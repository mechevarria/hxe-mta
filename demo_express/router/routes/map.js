'use strict';

const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
  const mapQuery = `
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
	WHERE GEO_LOCATION.ST_WITHIN(ST_GeomFromGeoJSON(?,0)) = 1;
  `;
  const polygon = req.body;
  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  try {
    req.db.exec(mapQuery, [JSON.stringify(polygon)]).forEach(result => {
      const feature = {
        type: 'Feature',
        properties: {
          eventId: result.eventId,
          eventType: result.eventType,
          eventDate: result.eventDate,
          actor1: result.actor1,
          actor2: result.actor2,
          countryName: result.countryName,
          fatalities: result.fatalities,
          notes: result.notes
        },
        geometry: JSON.parse(result.geoLocation)
      };
      featureCollection.features.push(feature);
    });

    res.json({
      'featureCollection': featureCollection
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[map]: ${err.message}` });
  }
});

module.exports = router;
