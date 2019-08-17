import { promisify } from 'util';
import MovieDB from 'moviedb-promise';
import download from 'download';
import { MOVIE_DB_KEY } from '../../../config';
import { Movie, Showtime } from '../../../models';
import { downloadTrailer } from './helpers';

const imdb = promisify(require('imdb'));

const moviedb = new MovieDB(MOVIE_DB_KEY);

export default async (req, res) => {
  const {
    query: { id },
    body,
    method
  } = req;

  if (method === 'POST') {
    res.json(await addMovieByMovieDBId(id));
  }

  if (method === 'GET') {
    res.json(await getMovieById(id));
  }

  if (method === 'PUT') {
    res.json(await updateMovieAndShowtimes(id, body));
  }
};

const updateMovieAndShowtimes = async (id, data) => {
  // Update movie
  const movie = await Movie.findByPk(id);
  await movie.update(data);

  // Delete all showtimes
  await Showtime.destroy({ where: { MovieId: id } });

  // Create new showtimes
  await Showtime.bulkCreate(data.showtimes.map(showtime => ({
    time: new Date(showtime),
    MovieId: id
  })));

  // Return updated movie
  return movie;
};

const getMovieById = id => {
  return Movie.findByPk(id, { include: Movie.associations.Showtimes });
};

const addMovieByMovieDBId = async movieId => {
  const movieToInsert = {};

  const [movie, movieCredits, movieDBConfig] = await Promise.all([
    moviedb.movieInfo({ id: movieId }),
    moviedb.movieCredits({ id: movieId }),
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

  const [imdbMovie, { results: videos }] = await Promise.all([
    imdb(movie.imdb_id),
    moviedb.movieVideos({ id: movieId }),
    download(`${movieDBConfig.images.base_url}original/${movie.poster_path}`, 'static/images/posters')
  ]);

  let youtubeTrailerId = '';

  videos.forEach(video => {
    if (video.type === 'Trailer' && video.site === 'YouTube' && youtubeTrailerId === '') {
      youtubeTrailerId = video.key;
    }
  });

  movieToInsert.imdb = Number(imdbMovie.rating);
  movieToInsert.summery = imdbMovie.description;

  const insertedMovie = await Movie.create(movieToInsert);

  // Kick off trailer download process
  downloadTrailer(youtubeTrailerId, 'static/videos', youtubeTrailerId).then(async () => {
    await insertedMovie.update({
      trailer: `${youtubeTrailerId}-cropped.mp4`
    });
  });

  return insertedMovie;
};
