import {Showtime} from '../../../models';
import {protect} from '../util/auth';
import {updateLatestShowtimeForMovie} from '../util/showtimes';

export default async (req, res) => {
  const {method, body, query} = req;

  await protect(req, res, {permissions: ['canEditPages']});

  if (method === 'PUT') {
    const showtime = await Showtime.update(body, {where: {id: query.id}});

    if (body.MovieId) {
      await updateLatestShowtimeForMovie(body.MovieId);
    }

    res.json(showtime);
  }

  if (method === 'DELETE') {
    await Showtime.destroy({where: {id: query.id}});

    res.json({});
  }
};
