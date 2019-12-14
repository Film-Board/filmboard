import {File} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    query: {id},
    body,
    method
  } = req;

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    await File.update(body, {where: {id}});

    res.json({});
  }

  if (method === 'DELETE') {
    await protect(req, res, {permissions: ['canEditPages']});

    await File.destroy({where: {id}});

    res.json({});
  }
};
