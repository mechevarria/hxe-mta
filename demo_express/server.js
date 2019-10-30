const http = require('http');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xsenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');

let app = express();
app.server = http.createServer(app);
app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));
app.use(compression());

// add hana client to all incoming requests
const services = xsenv.getServices({ hana: { tag: 'hana' } });
app.use('/', hdbext.middleware(services.hana));

// pass configured express server to routes
require('./router')(app);

app.server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${app.server.address().port}`);
});