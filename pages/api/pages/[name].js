import {Page, PageCategory} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    body,
    query
  } = req;

  if (method === 'GET') {
    res.json(await Page.findOne({where: {name: query.name}, include: {all: true}}));
  }

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    const page = await Page.findOne({where: {name: query.name}});

    const updateQuery = {
      name: body.name,
      content: body.content
    };

    if (body.category === 'None') {
      updateQuery.PageCategoryId = null;
    } else if (typeof body.category === 'string') {
      // Find category
      const category = await PageCategory.findOne({where: {name: body.category}});

      updateQuery.PageCategoryId = category.id;
    }

    await page.update(updateQuery);

    res.json(page);
  }

  if (method === 'DELETE') {
    await protect(req, res, {permissions: ['canEditPages']});

    await Page.destroy({where: {name: query.name}});

    res.json({});
  }
};
