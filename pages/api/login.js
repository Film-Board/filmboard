import {protect} from './util/auth';

export default async (req, res) => {
  const {method} = req;

  if (method === 'POST') {
    const user = await protect(req, res);

    return res.json(user);
  }
};
