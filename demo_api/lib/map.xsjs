/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */
const mapQuery = `
	SELECT EVENT_ID as "eventId", 
		GEO_LOCATION.ST_AsGeoJSON() as "geoLocation", 
		NOTES as "notes"
	FROM EVENT
	WHERE GEO_LOCATION.ST_WITHIN(ST_GeomFromGeoJSON(?,1000004326)) = 1;
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
				id: result.eventId,
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