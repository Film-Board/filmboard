import {Showtime} from '../../../models';
import {protect} from '../util/auth';
import {updateLatestShowtimeForMovie} from '../util/showtimes';

export default async (request, res) => {
  const {method, body, query} = request;

  await protect(request, res, {permissions: ['canEditPages']});

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
