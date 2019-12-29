import {sequelize} from '../../../models';

export const updateLatestShowtimeForMovie = id => {
  const query = `
    UPDATE
  	 "Movies"
    SET
    	"latestShowtime" = s. "latestShowtime"
    FROM (
    	SELECT
    		MAX("Showtimes"."time") AS "latestShowtime",
    		"MovieId"
    	FROM
    		"Showtimes"
    	WHERE "MovieId" = ${id}
    	GROUP BY
    		"MovieId") AS s
    WHERE
    	"Movies"."id" = s."MovieId";
    `;

  return sequelize.query(query);
};
