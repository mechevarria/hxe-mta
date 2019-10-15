/*eslint quotes: ["error", "single"]*/
/*eslint-env es6 */
const eventQuery = `
	SELECT event_id,
       event_date,
       event_type,
       actor_1,
       actor_2,
       country_name,
       fatalities,
       geo_location.ST_AsGeoJSON() as GEO_LOCATION,
       notes
	FROM EVENT
	LIMIT ?
	OFFSET ?
`;
const limit = $.request.parameters.get('limit') || 10;
const offset = $.request.parameters.get('offset') || 0;

const countQuery = `
	SELECT record_count
	FROM   m_tables
	WHERE  table_name = 'EVENT';  
`;
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const count = conn.executeQuery(countQuery);
	const results = conn.executeQuery(eventQuery, limit, offset);

	$.response.setBody(JSON.stringify({
		'results': results,
		'count': count[0].RECORD_COUNT
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'Query Error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();