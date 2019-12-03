import {promisify} from 'util';
import fs from 'fs';
import path from 'path';
import MovieDB from 'moviedb-promise';
import fetchRTdata from 'rottentomatoes-data';
import download from 'download';
import hasha from 'hasha';
import {MOVIE_DB_KEY, BUCKET_PATH} from '../../../../config';
import {Movie, File, Trailer} from '../../../../models';
import {protect} from '../../util/auth';
import {downloadTrailer} from '../helpers';

const imdb = promisify(require('imdb'));

const moviedb = new MovieDB(MOVIE_DB_KEY);

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
  const posterPath = `${posterHash}.${movie.poster_path.split('.')[1]}`;
  let poster = {};

  if (fs.existsSync(path.join(BUCKET_PATH, posterPath))) {
    poster = await File.findOne({where: {hash: posterHash}});
  } else {
    // Add Poster record
    poster = await File.create({path: posterPath, hash: posterHash});

    await download(`${movieDBConfig.images.base_url}original/${movie.poster_path}`, BUCKET_PATH, {
      filename: posterPath
    });
  }

  const [imdbMovie, {results: videos}, tomatoes] = await Promise.all([
    imdb(movie.imdb_id),
    moviedb.movieVideos({id: movieId}),
    fetchRTdata(movie.title)
  ]);

  if (tomatoes.ok) {
    movieToInsert.rottenTomatoes = tomatoes.movie.meterScore;
  } else {
    movieToInsert.rottenTomatoes = 0;
  }

  let youtubeTrailerId = '';

  videos.forEach(video => {
    if (video.type === 'Trailer' && video.site === 'YouTube' && youtubeTrailerId === '') {
      youtubeTrailerId = video.key;
    }
  });

  movieToInsert.imdb = Number(imdbMovie.rating);
  movieToInsert.summery = imdbMovie.description;

  const insertedMovie = await Movie.create(movieToInsert);

  const trailerHash = hasha(youtubeTrailerId);
  const trailerPath = `${trailerHash}.mp4`;

  let trailer;
  if (fs.existsSync(path.join(BUCKET_PATH, trailerPath))) {
    const trailerFile = await File.findOne({where: {hash: trailerHash}});
    trailer = await Trailer.findOne({where: {FileId: trailerFile.id}});
  } else {
    const trailerFile = await File.create({hash: trailerHash, path: trailerPath});
    trailer = await Trailer.create({});
    await trailer.setFile(trailerFile);

    // Kick off trailer download process
    downloadTrailer(trailer, youtubeTrailerId, BUCKET_PATH, trailerHash);
  }

  await Promise.all([
    insertedMovie.setPoster(poster),
    insertedMovie.setTrailer(trailer)
  ]);

  return insertedMovie;
};
