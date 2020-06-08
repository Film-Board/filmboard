import {Page, PageCategory} from '../../../models';
import {protect} from '../util/auth';

export default async (request, res) => {
  const {
    method,
    body
  } = request;

  if (method === 'POST') {
    await protect(request, res, {permissions: ['canEditPages']});

    const newPage = {
      name: body.name,
      content: body.content
    };

    if (body.category === 'None') {
      newPage.PageCategoryId = null;
    } else if (typeof body.category === 'string') {
      // Find category
      const category = await PageCategory.findOne({where: {name: body.category}});

      newPage.PageCategoryId = category.id;
    }

    res.json(await Page.create(newPage));
  }

  if (method === 'GET') {
    res.json(await Page.findAll({attributes: {exclude: ['content']}, include: {all: true}}));
  }
};
