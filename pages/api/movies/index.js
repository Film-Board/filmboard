import {Movie, Showtime} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    query,
    body
  } = req;

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
      include: {all: true},
      order: [[Showtime, 'time', 'DESC']]
    };

    if (getHidden) {
      delete filters.where;
    }

    let results = await Movie.findAll(filters);

    if (query.limit) {
      results = results.slice(0, Number(query.limit));
    }

    res.json(results);
  }

  if (method === 'POST') {
    await protect(req, res, {permissions: ['canEditPages']});

    res.json(await Movie.create(body));
  }
};
