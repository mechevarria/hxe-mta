$.response.contentType = "application/json";
var conn = $.hdb.getConnection();
var limit = $.request.parameters.get("limit") || 10;
var offset = $.request.parameters.get("offset") || 0;

var events = "select * from event limit ? offset ?";
var count = "select count(event_id) as count from event";

var results = [];

try {
	count = conn.executeQuery(count);
	results = conn.executeQuery(events, limit, offset);
	
	$.response.setBody(JSON.stringify({
		"results": results,
		"count" : count[0].COUNT
	}));
	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(JSON.stringify({
		"Query Error": e.message
	}));
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}

conn.close();