const http = require('http');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const middleware = require('./middleware');

let app = express();
app.server = http.createServer(app);


app.use(morgan('combined'));

app.use(bodyParser.json({ extended: true }));

app.use(compression());

// add hana object to req
app.use(middleware);

// pass configured express server to routes
require('./router')(app);

app.server.listen(process.env.PORT || 3000, () => {
  console.log(`Started on port ${app.server.address().port}`);
});