/*eslint quotes: ["error", "single"]*/
/*eslint-env es6 */
const donutQuery = `
	SELECT EVENT_TYPE,
       COUNT(EVENT_TYPE) AS COUNT
	FROM EVENT
	GROUP BY EVENT_TYPE;
`;

const barQuery = `
	SELECT COUNTRY_NAME,
       COUNT(COUNTRY_NAME) AS COUNT
	FROM EVENT
	GROUP BY COUNTRY_NAME; 
`;
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const donut = conn.executeQuery(donutQuery);
	const bar = conn.executeQuery(barQuery);

	$.response.setBody(JSON.stringify({
		'donut': donut,
		'bar': bar
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'Query Error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();