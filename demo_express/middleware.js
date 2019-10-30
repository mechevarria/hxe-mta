'use string';

const xsenv = require('@sap/xsenv');
const hana = require('@sap/hana-client');

const services = xsenv.getServices({ hana: { tag: 'hana' } });
hana.hanaOptions = services.hana;

const middleware = ((req, res, next) => {
  req.hana = hana;
  next();
})

module.exports = middleware;