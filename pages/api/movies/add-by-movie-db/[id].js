import {promisify} from 'util';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import MovieDB from 'moviedb-promise';
import download from 'download';
import hasha from 'hasha';
import omdb from 'omdb-client';
import {MOVIE_DB_KEY, OMDB_KEY, BUCKET_PATH} from '../../../../config';
import {Movie, File} from '../../../../models';
import {protect} from '../../util/auth';
import {downloadTrailer} from '../helpers';

const moviedb = new MovieDB(MOVIE_DB_KEY);
const getOMDBMovie = promisify(omdb.get);

export default async (req, res) => {
  const {
    query: {id},
    method
  } = req;

  await protect(req, res, {permissions: ['canEditPages']});

  if (method === 'POST') {
    res.json(await addMovieByMovieDBId(id));
  }
};

const addMovieByMovieDBId = async movieId => {
  const movieToInsert = {};

  // Get movie details
  const [movie, movieCredits, movieDBConfig] = await Promise.all([
    moviedb.movieInfo({id: movieId}),
    moviedb.movieCredits({id: movieId}),
    moviedb.configuration()
  ]);

  movieToInsert.name = movie.title;
  movieToInsert.runtime = movie.runtime;
  movieToInsert.poster = movie.poster_path.slice(1);
  movieToInsert.ticketPrice = 3;
  movieToInsert.concessionPrice = 1;

  movieToInsert.directedBy = (movieCredits.crew.find(crewMember => crewMember.job === 'Director')).name;

  movieToInsert.staring = movieCredits.cast
    .slice(0, 3) // First 3 actors
    .map(actor => actor.name) // Get actor's name
    .reduce((accumulator, actorName) => { // Assemble string
      if (accumulator !== '') {
        return `${accumulator}, ${actorName}`;
      }

      return actorName;
    }, '');

  // Get IMDB results, potential trailers, and download the poster
  const posterHash = hasha(movie.poster_path);
  const posterPath = `${posterHash}.jpeg`;
  let poster = {};

  if (fs.existsSync(path.join(BUCKET_PATH, posterPath))) {
    poster = await File.findOne({where: {hash: posterHash}});
  } else {
    // Add Poster record
    poster = await File.create({path: posterPath, hash: posterHash});

    // Download and resize poster
    await new Promise((resolve, reject) => {
      try {
        download(`${movieDBConfig.images.base_url}original/${movie.poster_path}`).pipe(
          sharp()
            .resize(440, 720, {fit: 'inside'})
            .jpeg()
        ).pipe(fs.createWriteStream(path.join(BUCKET_PATH, posterPath))).on('finish', () => resolve());
      } catch (error) {
        reject(error);
      }
    });
  }

  const [omdbMovie, {results: videos}] = await Promise.all([
    getOMDBMovie({apiKey: OMDB_KEY, id: movie.imdb_id}),
    moviedb.movieVideos({id: movieId})
  ]);

  const movieRatings = omdbMovie.Ratings.reduce((accum, value) => {
    accum[value.Source] = value.Value;
    return accum;
  }, {});

  if (movieRatings['Internet Movie Database']) {
    movieToInsert.imdb = Number(movieRatings['Internet Movie Database'].split('/')[0]);
  }

  if (movieRatings['Rotten Tomatoes']) {
    movieToInsert.rottenTomatoes = Number(movieRatings['Rotten Tomatoes'].split('%')[0]);
  }

  movieToInsert.summary = omdbMovie.Plot;

  let youtubeTrailerId = '';

  videos.forEach(video => {
    if (video.type === 'Trailer' && video.site === 'YouTube' && youtubeTrailerId === '') {
      youtubeTrailerId = video.key;
    }
  });

  const insertedMovie = await Movie.create(movieToInsert);

  // Kick off trailer download process
  if (youtubeTrailerId !== '') {
    downloadTrailer(youtubeTrailerId, insertedMovie).catch(async () => {
      await insertedMovie.update({TrailerId: null});
    });
  }

  await insertedMovie.setPoster(poster);

  return insertedMovie;
};
