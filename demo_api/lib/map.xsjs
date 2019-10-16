/*eslint quotes: ["error", "single"]*/
/*eslint-env es6 */
const mapQuery = `
	SELECT EVENT_ID, GEO_LOCATION.ST_AsGeoJSON() as GEO_LOCATION, NOTES
	FROM EVENT
	WHERE GEO_LOCATION.ST_WITHIN(ST_GeomFromGeoJSON(?,1000004326)) = 1;
`;

let polygon = JSON.parse($.request.body.asString());
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const results = conn.executeQuery(mapQuery, JSON.stringify(polygon));
	
	// build feature collection
	let featureCollection = {
		type: 'FeatureCollection',
		features: []
	};
	
	results.forEach(result => {
		let feature = {
			type: 'Feature',
			properties : {
				id : result.EVENT_ID,
				notes: result.NOTES
			},
			geometry: JSON.parse(result.GEO_LOCATION)
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