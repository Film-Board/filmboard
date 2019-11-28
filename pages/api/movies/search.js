import {Op} from 'sequelize';
import {Movie, Showtime, sequelize} from '../../../models';

export default async (req, res) => {
  const {query} = req;

  const options = {
    where: {},
    include: {all: true},
    order: [[Showtime, 'time', 'DESC']]
  };

  // Search by name
  let filteredIds = [];
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

    filteredIds = results.map(result => result.id);
  }

  // Limit results
  if (query.limit) {
    options.limit = query.limit;
  }

  // Select by date range
  if (query.fromDate) {
    options.where['$Showtimes.time$'] = {
      [Op.between]: [new Date(query.fromDate), new Date()]
    };
  }

  if (query.toDate) {
    options.where['$Showtimes.time$'] = {
      [Op.between]: [new Date(0), new Date(query.toDate)]
    };
  }

  if (query.fromDate && query.toDate) {
    options.where['$Showtimes.time$'] = {
      [Op.between]: [new Date(query.fromDate), new Date(query.toDate)]
    };
  }

  // Check for search query
  if (isFullTextSearch) {
    options.where.id = filteredIds;
  }

  res.json(await Movie.findAll(options));
};
