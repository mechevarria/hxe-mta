'use string';

const hana = {
  db : 'hana'
};

const middleware = ((req, res, next) => {
  req.hana = hana;
  next();
})

module.exports = middleware;