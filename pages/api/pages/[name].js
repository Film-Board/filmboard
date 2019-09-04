import { Page } from '../../../models';

export default async (req, res) => {
  const {
    method,
    body,
    query
  } = req;

  if (method === 'GET') {
    res.json(await Page.findOne({ where: { name: query.name } }));
  }

  if (method === 'PUT') {
    const page = await Page.findOne({ where: { name: query.name } });

    await page.update({
      name: body.name,
      content: body.content
    });

    res.json(page);
  }
};
