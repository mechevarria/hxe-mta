const event = require('./routes/event');
const map = require('./routes/map');
const chart = require('./routes/chart');
const search = require('./routes/search');
const types = require('./routes/types');
const analysis = require('./routes/analysis');

module.exports = ((app) => {
  app.use('/index', (req, res) => {
    res.json({ message: 'This is the express route for /index' });
  });

  app.use('/event', event);
  app.use('/map', map);
  app.use('/search', search);
  app.use('/chart', chart);
  app.use('/types', types);
  app.use('/analysis', analysis);
});