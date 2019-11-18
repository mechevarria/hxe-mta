const event = require('./routes/event');
const map = require('./routes/map');
const chart = require('./routes/chart');
const search = require('./routes/search');
const types = require('./routes/types');
const analysis = require('./routes/analysis');

module.exports = ((app) => {
  app.use('/index.xsjs', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  app.use('/event.xsjs', event);
  app.use('/map.xsjs', map);
  app.use('/search.xsjs', search);
  app.use('/chart.xsjs', chart);
  app.use('/types.xsjs', types);
  app.use('/analysis.xsjs', analysis);
});