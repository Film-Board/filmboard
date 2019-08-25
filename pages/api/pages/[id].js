import { Page } from '../../../models';

export default async (req, res) => {
  const {
    method,
    body,
    query
  } = req;

  if (method === 'GET') {
    res.json(await Page.findByPk(query.id));
  }

  if (method === 'PUT') {
    const page = await Page.findByPk(query.id);

    await page.update({
      name: body.name,
      content: body.content
    });

    res.json(page);
  }
};
