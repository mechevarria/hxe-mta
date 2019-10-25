/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */
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
const search = $.request.parameters.get('search') || '';
const fuzzy = $.request.parameters.get('fuzzy') || 0.8;
const limit = $.request.parameters.get('limit') || 10;

const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const results = conn.executeQuery(searchQuery, search, fuzzy, limit);
	
	results.forEach(result => {
		result.geoLocation = JSON.parse(result.geoLocation);
	});

	$.response.setBody(JSON.stringify({
		'results': results,
		'count': results.length
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();