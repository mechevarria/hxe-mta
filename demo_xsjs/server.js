/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 8080;

var options = {
	anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
	redirectUrl : "/index.xsjs"
};

// add HANA client to all incoming requests. json file is only read when not running on XS Advanced Server
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }, '/tmp/default-services.json'));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);
