import {promisify} from 'util';
import MovieDB from 'moviedb-promise';
import download from 'download';
import {hash} from '../../util/random';
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
  movieToInsert.poster = movie.poster_path.substring(1);

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
  const posterHash = hash();
  const posterPath = `${posterHash}.${movie.poster_path.split('.')[1]}`;

  const [imdbMovie, {results: videos}] = await Promise.all([
    imdb(movie.imdb_id),
    moviedb.movieVideos({id: movieId}),
    download(`${movieDBConfig.images.base_url}original/${movie.poster_path}`, BUCKET_PATH, {
      filename: posterPath
    })
  ]);

  // Add Poster record
  const poster = await File.create({path: posterPath, hash: posterHash});

  let youtubeTrailerId = '';

  videos.forEach(video => {
    if (video.type === 'Trailer' && video.site === 'YouTube' && youtubeTrailerId === '') {
      youtubeTrailerId = video.key;
    }
  });

  movieToInsert.imdb = Number(imdbMovie.rating);
  movieToInsert.summery = imdbMovie.description;

  const insertedMovie = await Movie.create(movieToInsert);

  const trailer = await Trailer.create({});
  const trailerHash = hash();
  let trailerFile;
  try {
    trailerFile = await File.create({hash: trailerHash, path: `${trailerHash}.mp4`});
  } catch (error) {
    console.log(error);
  }

  await Promise.all([
    insertedMovie.setPoster(poster),
    insertedMovie.setTrailer(trailer),
    trailer.setFile(trailerFile)
  ]);

  // Kick off trailer download process
  downloadTrailer(trailer, youtubeTrailerId, BUCKET_PATH, trailerHash);

  return insertedMovie;
};
