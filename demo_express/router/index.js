const event = require('./routes/event');
const map = require('./routes/map');
const chart = require('./routes/chart');
const search = require('./routes/search');

module.exports = ((app) => {
  app.use('/index.xsjs', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  app.use('/event.xsjs', event);
  app.use('/map.xsjs', map);
  app.use('/search.xsjs', search);
  app.use('/chart.xsjs', chart);
});