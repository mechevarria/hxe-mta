const fs = require('fs');
const http = require('http');
const https = require('https');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xsenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');

let app = express();

app.set('port', process.env.PORT || 8080);
app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));
app.use(compression());

// add HANA client to all incoming requests. json file is only read when not running on XS Advanced Server
const services = xsenv.getServices({ hana: { tag: 'hana' } }, '/tmp/default-services.json');
app.use('/', hdbext.middleware(services.hana));

// pass configured express server to routes
require('./router')(app);

// check to see if running on HANA
if (process.env.VCAP_APPLICATION) {
  console.log('Running on XS Advanced Server, router provides https');

  http.createServer(app)
    .listen(app.get('port'), () => {
      console.info(`http server started on port ${app.get('port')}`);
    });
} else {
  console.info('NOT Running on XS Advanced Server, using local https');

  const certConfig = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }

  https.createServer(certConfig, app)
    .listen(8443, () => {
      console.log('https server started on port 8443');
    });
}