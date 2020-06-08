import {Op} from 'sequelize';
import {Movie, Trailer, Showtime, sequelize} from '../../../models';
import {protect} from '../util/auth';

export default async (request, res) => {
  const {
    method,
    query,
    body
  } = request;

  if (method === 'GET') {
    let getHidden = true;

    try {
      await protect(request, res, {sendResponse: false});
    } catch {
      getHidden = false;
    }

    const options = {
      where: {
        hidden: false
      },
      distinct: true,
      include: [
        Movie.associations.Poster,
        {
          model: Showtime
        },
        {
          model: Trailer,
          include: Trailer.associations.File
        }
      ],
      order: [['latestShowtime', 'DESC']]
    };

    if (getHidden) {
      delete options.where.hidden;
    }

    if (query.limit) {
      options.limit = query.limit;
    }

    // Search by name
    const isFullTextSearch = query.search && query.search !== '';

    if (isFullTextSearch) {
      const results = await sequelize.query(`
        SELECT *
        FROM "public"."Movies"
        WHERE name @@ plainto_tsquery('english', :query);
      `, {
        model: Movie,
        replacements: {query: query.search}
      });

      const filteredIds = results.map(result => result.id);

      options.where.id = filteredIds;
    }

    // Select by date range
    if (query.fromDate) {
      options.where.latestShowtime = {
        [Op.between]: [new Date(query.fromDate), new Date(10000000000000)]
      };
    }

    if (query.toDate) {
      options.where.latestShowtime = {
        [Op.between]: [new Date(0), new Date(query.toDate)]
      };
    }

    if (query.fromDate && query.toDate) {
      options.where.latestShowtime = {
        [Op.between]: [new Date(query.fromDate), new Date(query.toDate)]
      };
    }

    const results = await Movie.findAll(options);

    res.json(results);
  }

  if (method === 'POST') {
    await protect(request, res, {permissions: ['canEditPages']});

    res.json(await Movie.create(body));
  }
};
