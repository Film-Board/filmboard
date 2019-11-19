import {Movie, Showtime, Trailer} from '../../../models';

export default async (req, res) => {
  const {
    method,
    query
  } = req;

  const limit = Number(query.limit) || 100;

  if (method === 'GET') {
    res.json(await Movie.findAll({
      limit,
      include: [
        Movie.associations.Poster,
        Movie.associations.Showtimes,
        {
          model: Trailer,
          include: Trailer.associations.File
        }
      ],
      order: [[Showtime, 'time', 'DESC']]
    }));
  }
};
