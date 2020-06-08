import {File} from '../../../models';
import {protect} from '../util/auth';

export default async (request, res) => {
  const {
    query: {id},
    body,
    method
  } = request;

  if (method === 'PUT') {
    await protect(request, res, {permissions: ['canEditPages']});

    await File.update(body, {where: {id}});

    res.json({});
  }

  if (method === 'DELETE') {
    await protect(request, res, {permissions: ['canEditPages']});

    await File.destroy({where: {id}});

    res.json({});
  }
};
