import {Page} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    body
  } = req;

  if (method === 'POST') {
    await protect(req, res, {permissions: ['canEditPages']});

    const newPage = await Page.create({
      name: body.pageName,
      content: body.pageText
    });

    res.json(newPage);
  }

  if (method === 'GET') {
    res.json(await Page.findAll({attributes: {exclude: ['content']}}));
  }
};
