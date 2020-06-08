import {PageCategory} from '../../../models';
import {protect} from '../util/auth';

export default async (request, res) => {
  const {
    method,
    body
  } = request;

  if (method === 'GET') {
    const categories = await PageCategory.findAll();

    res.json(categories);
  }

  if (method === 'POST') {
    await protect(request, res, {permissions: ['canEditPages']});

    const category = await PageCategory.create({
      name: body.name
    });

    res.json(category);
  }

  if (method === 'DELETE') {
    await protect(request, res, {permissions: ['canEditPages']});

    await PageCategory.destroy({where: {name: body.name}});

    res.json({});
  }
};
