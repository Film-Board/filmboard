import MovieDB from 'moviedb-promise';
import config from '../../../../config';

const moviedb = new MovieDB(config.MOVIE_DB_KEY);

export default async (req, res) => {
  const {
    query: {name}
  } = req;

  const movies = await moviedb.searchMovie({query: name});

  res.json(movies.results.filter(movie => movie.vote_count > 20).sort((a, b) => {
    return new Date(b.release_date) - new Date(a.release_date);
  }));
};
