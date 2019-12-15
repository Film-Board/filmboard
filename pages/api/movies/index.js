import {Movie, Showtime, Trailer} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    query,
    body
  } = req;

  const limit = Number(query.limit) || 100;

  if (method === 'GET') {
    let getHidden = true;

    try {
      await protect(req, res, {sendResponse: false});
    } catch (_) {
      getHidden = false;
    }

    const filters = {
      where: {
        hidden: false
      },
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
    };

    if (getHidden) {
      delete filters.where;
    }

    res.json(await Movie.findAll(filters));
  }

  if (method === 'POST') {
    await protect(req, res, {permissions: ['canEditPages']});

    res.json(await Movie.create(body));
  }
};
