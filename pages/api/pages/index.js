import { Page } from '../../../models';

export default async (req, res) => {
  const {
    method,
    query,
    body
  } = req;

  if (method === 'POST') {
    const newPage = await Page.create({
      name: body.pageName,
      content: body.pageText
    });

    res.json(newPage);
  }
};
