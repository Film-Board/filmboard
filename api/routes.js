const express = require('express');
const {promisify} = require('util');
const config = require('../config');
const MovieDB = require('moviedb-promise');
const youtubeSearch = promisify(require('youtube-search'));
const imdb = promisify(require('imdb'));
const download = require('download');
const {Movie} = require('../models');

const router = express.Router();
const moviedb = new MovieDB(config.MOVIE_DB_KEY);

router.get('/movies/autosuggest/:name', async (req, res) => {
  const movieName = req.params.name;

  const movies = await moviedb.searchMovie({query: movieName});

  res.json(movies.results.filter(movie => movie.vote_count > 20));
});

router.post('/movies/add/:movieId', async (req, res) => {
  const {movieId} = req.params;

  const movieToInsert = {};

  const [movie, movieDBConfig] = await Promise.all([
    moviedb.movieInfo({id: movieId}),
    moviedb.configuration()]);

  console.log(movie, movieDBConfig);

  movieToInsert.name = movie.title;
  movieToInsert.runtime = movie.runtime;
  movieToInsert.poster = movie.poster_path.substring(1);

  const [imdbMovie, trailers] = await Promise.all([
    imdb(movie.imdb_id),
    youtubeSearch(`${movieToInsert.name} trailer`, {key: config.YOUTUBE_KEY}),
    download(`${movieDBConfig.images.base_url}original/${movie.poster_path}`, 'static/images/posters')])

  movieToInsert.imdb = Number(imdbMovie.rating)
  movieToInsert.summery = imdbMovie.description
  movieToInsert.youtubeTrailerId = trailers[0].id;

  const insertedMovie = await Movie.create(movieToInsert)

  res.json(insertedMovie);
})

module.exports = router;
