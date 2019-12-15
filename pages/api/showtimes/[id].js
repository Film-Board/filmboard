import {Showtime} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {method, body, query} = req;

  await protect(req, res, {permissions: ['canEditPages']});

  if (method === 'PUT') {
    res.json(await Showtime.update(body, {where: {id: query.id}}));
  }

  if (method === 'DELETE') {
    await Showtime.destroy({where: {id: query.id}});

    res.json({});
  }
};
