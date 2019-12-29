import {Showtime} from '../../../models';
import {protect} from '../util/auth';
import {updateLatestShowtimeForMovie} from '../util/showtimes';

export default async (req, res) => {
  const {method, body} = req;

  await protect(req, res, {permissions: ['canEditPages']});

  if (method === 'POST') {
    const showtime = await Showtime.create(body);

    if (body.MovieId) {
      await updateLatestShowtimeForMovie(body.MovieId);
    }

    res.json(showtime);
  }
};
