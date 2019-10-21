/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */
const donutQuery = `
	SELECT EVENT_TYPE as "eventType", COUNT(EVENT_TYPE) AS "count"
	FROM EVENT
	GROUP BY EVENT_TYPE;
`;

const barQuery = `
	SELECT COUNTRY_NAME as "countryName", COUNT(COUNTRY_NAME) AS "count"
	FROM EVENT
	GROUP BY COUNTRY_NAME; 
`;
const conn = $.hdb.getConnection();

$.response.contentType = 'application/json';
try {
	const donutLabels = [];
	const donutData = [];
	conn.executeQuery(donutQuery).forEach(result => {
		donutLabels.push(result.eventType);
		donutData.push(result.count);
	});
	
	const barLabels = [];
	const barData = [{
		data: []
	}];
	conn.executeQuery(barQuery).forEach(result => {
		barLabels.push(result.countryName);
		barData[0].data.push(result.count);
	});

	$.response.setBody(JSON.stringify({
		'donutLabels': donutLabels,
		'donutData': donutData,
		'barLabels': barLabels,
		'barData': barData
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		'Query Error': e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
conn.close();