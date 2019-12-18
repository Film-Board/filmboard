import {Movie} from '../../../../models';
import {downloadTrailer} from '../helpers';
import {protect} from '../../util/auth';

export default async (req, res) => {
  const {
    query: {id},
    body,
    method
  } = req;

  if (method === 'PUT') {
    await protect(req, res, {permissions: ['canEditPages']});

    const movie = await Movie.findByPk(id);

    downloadTrailer(body.url, movie);

    res.json({started: true});
  }
};
