'use strict';

const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {

  const hana = req.hana;
  // test connection
  let client = hana.createConnection();
  client.connect(hana.hanaOptions, (err) => {
    if (err) {
      console.error('Error in event', err);
      res.status(500).json(err);
    }
    console.log('Connection successful');
    res.json({ events: 'none' });
    client.disconnect();
  });

});

module.exports = router;
