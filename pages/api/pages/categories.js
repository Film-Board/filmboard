import {PageCategory} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    body
  } = req;

  if (method === 'GET') {
    const categories = await PageCategory.findAll();

    res.json(categories);
  }

  if (method === 'POST') {
    await protect(req, res, {permissions: ['canEditPages']});

    const category = await PageCategory.create({
      name: body.name
    });

    res.json(category);
  }

  if (method === 'DELETE') {
    await protect(req, res, {permissions: ['canEditPages']});

    await PageCategory.destroy({where: {name: body.name}});

    res.json({});
  }
};
