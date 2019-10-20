import { User } from '../../../models';
import { protect } from '../util/auth';

export default async (req, res) => {
  const { method, body } = req;

  await protect(req, res, { permissions: ['canManageUsers'] });

  if (method === 'GET') {
    res.json(await User.findAll());
  }

  if (method === 'POST') {
    const newUser = body;

    res.json(await User.create(newUser));
  }

  if (method === 'PUT') {
    res.json(await User.update(body, { where: { email: body.email } }));
  }

  if (method === 'DELETE') {
    res.json(await User.destroy({ where: { email: body.email } }));
  }
};
