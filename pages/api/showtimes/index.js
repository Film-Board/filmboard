import {Showtime} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {method, body} = req;

  await protect(req, res, {permissions: ['canEditPages']});

  if (method === 'POST') {
    res.json(await Showtime.create(body));
  }
};
