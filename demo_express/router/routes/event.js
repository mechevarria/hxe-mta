'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {

  req.db.exec('SELECT SESSION_USER FROM DUMMY', (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results);
    }
  })

});

module.exports = router;
