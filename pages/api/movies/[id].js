import {Movie, Showtime, Trailer} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    query: {id},
    body,
    method
  } = req;

  if (method === 'GET') {
    res.json(await getMovieById(id));
  }

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    res.json(await updateMovieAndShowtimes(id, body));
  }

  if (method === 'DELETE') {
    await protect(req, res, {permissions: ['canEditPages']});

    await Movie.destroy({where: {id}});

    res.json({});
  }
};

const updateMovieAndShowtimes = async (id, data) => {
  // Update movie
  const movie = await Movie.findByPk(id);
  await movie.update(data);

  // Delete all showtimes
  await Showtime.destroy({where: {MovieId: id}});

  // Create new showtimes
  await Showtime.bulkCreate(data.showtimes.map(showtime => ({
    time: new Date(showtime),
    MovieId: id
  })));

  // Return updated movie
  return movie;
};

const getMovieById = id => {
  return Movie.findByPk(id, {include: [
    Movie.associations.Poster,
    Movie.associations.Showtimes,
    {
      model: Trailer,
      include: Trailer.associations.File
    }
  ]});
};
