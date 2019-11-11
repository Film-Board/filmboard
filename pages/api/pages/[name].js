import {Page} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    body,
    query
  } = req;

  if (method === 'GET') {
    res.json(await Page.findOne({where: {name: query.name}}));
  }

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    const page = await Page.findOne({where: {name: query.name}});

    await page.update({
      name: body.name,
      content: body.content
    });

    res.json(page);
  }

  if (method === 'DELETE') {
    await protect(req, res, {permissions: ['canEditPages']});

    await Page.destroy({where: {name: query.name}});

    res.json({});
  }
};
