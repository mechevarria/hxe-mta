'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  const eventQuery = `
	SELECT EVENT_ID as "eventId",
       EVENT_DATE as "eventDate",
       EVENT_TYPE as "eventType",
       ACTOR_1 as "actor1",
       ACTOR_2 as "actor2",
       COUNTRY_NAME as "countryName",
       FATALITIES as "fatalities",
       GEO_LOCATION.ST_AsGeoJSON() as "geoLocation",
       NOTES as "notes"
	FROM EVENT
	LIMIT ?
	OFFSET ?
  `;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  const countQuery = `
	SELECT RECORD_COUNT as "recordCount"
	FROM   M_TABLES
	WHERE  TABLE_NAME = 'EVENT';  
  `;

  try {
    const count = req.db.exec(countQuery);
    const results = req.db.exec(eventQuery, [limit, offset]);

    results.forEach(result => {
      result.geoLocation = JSON.parse(result.geoLocation);
    });

    res.json({
      'results': results,
      'count': count[0].recordCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[event]: ${err.message}` });
  }

});

module.exports = router;