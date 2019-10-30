const event = require('./routes/event');
const map = require('./routes/map');

module.exports = ((app) => {
  app.use('/', event);
  app.use('/map', map);
});