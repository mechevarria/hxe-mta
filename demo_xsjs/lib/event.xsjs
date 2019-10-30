/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */
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
const limit = $.request.parameters.get('limit') || 10;
const offset = $.request.parameters.get('offset') || 0;

const countQuery = `
	SELECT RECORD_COUNT as "recordCount"
	FROM   M_TABLES
	WHERE  TABLE_NAME = 'EVENT';  
`;
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const count = conn.executeQuery(countQuery);
	const results = conn.executeQuery(eventQuery, limit, offset);
	
	results.forEach(result => {
		result.geoLocation = JSON.parse(result.geoLocation);
	});

	$.response.setBody(JSON.stringify({
		'results': results,
		'count': count[0].recordCount
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'Query Error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();