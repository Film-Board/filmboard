import {Keystore} from '../../models';
import {protect} from './util/auth';

export default async (req, res) => {
  const {method, body, query} = req;

  if (method === 'GET') {
    const model = await Keystore.findOne({where: {name: query.name}});

    if (model === null) {
      res.json({});
    } else {
      res.json(model);
    }
  }

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    console.log(query, body);

    const model = await Keystore.findOne({where: {name: query.name}});

    if (model === null) {
      await Keystore.create({name: query.name, value: body.value});
    } else {
      await Keystore.update({name: query.name, value: body.value}, {where: {name: query.name}});
    }

    res.json({name: query.name, value: body.value});
  }
};
