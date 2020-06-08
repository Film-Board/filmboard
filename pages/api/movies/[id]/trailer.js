import {Movie} from '../../../../models';
import {downloadTrailer} from '../helpers';
import {protect} from '../../util/auth';

export default async (request, res) => {
  const {
    query: {id},
    body,
    method
  } = request;

  if (method === 'PUT') {
    await protect(request, res, {permissions: ['canEditPages']});

    const movie = await Movie.findByPk(id);

    downloadTrailer(body.url, movie);

    res.json({started: true});
  }
};
