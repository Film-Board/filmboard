import {Op} from 'sequelize';
import {Movie, Trailer, Showtime, sequelize} from '../../../models';
import {protect} from '../util/auth';

export default async (req, res) => {
  const {
    method,
    query,
    body
  } = req;

  if (method === 'GET') {
    let getHidden = true;

    try {
      await protect(req, res, {sendResponse: false});
    } catch (_) {
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
    await protect(req, res, {permissions: ['canEditPages']});

    res.json(await Movie.create(body));
  }
};
