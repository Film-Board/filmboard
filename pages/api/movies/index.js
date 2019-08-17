import { Movie } from '../../../models';

export default async (req, res) => {
  const {
    method
  } = req;

  if (method === 'GET') {
    res.json(await Movie.findAll());
  }
};
