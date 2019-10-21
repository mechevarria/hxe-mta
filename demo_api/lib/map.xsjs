/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */
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

const polygon = JSON.parse($.request.body.asString());
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';

const featureCollection = {
	type: 'FeatureCollection',
	features: []
};
try {
	conn.executeQuery(mapQuery, JSON.stringify(polygon)).forEach(result => {
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

	$.response.setBody(JSON.stringify({
		featureCollection
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'Query Error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();