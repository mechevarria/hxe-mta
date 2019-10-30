'use strict';

const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.json({ events: req.hana });
});

module.exports = router;
