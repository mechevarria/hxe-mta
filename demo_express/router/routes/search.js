'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  const searchQuery = `
	SELECT EVENT_ID as "eventId",
       EVENT_DATE as "eventDate",
       EVENT_TYPE as "eventType",
       ACTOR_1 as "actor1",
       ACTOR_2 as "actor2",
       COUNTRY_NAME as "countryName",
       FATALITIES as "fatalities",
       GEO_LOCATION.ST_AsGeoJSON() as "geoLocation",
       HIGHLIGHTED(NOTES) as "notes"
	FROM EVENT
	WHERE CONTAINS(notes, ?, Fuzzy(?))
	LIMIT ?
  `;
  const search = req.query.search || '';
  const fuzzy = req.query.fuzzy || 0.8;
  const limit = req.query.limit || 10;

  try {
    const results = req.db.exec(searchQuery, [search, fuzzy, limit]);
	
    results.forEach(result => {
      result.geoLocation = JSON.parse(result.geoLocation);
    });
  
    res.json({
      'results': results,
      'count': results.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[search]: ${err.message}` });
  }
});

module.exports = router;