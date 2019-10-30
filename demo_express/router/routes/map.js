'use strict';

const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
  const polygon = req.body;
  res.json(polygon);
});

module.exports = router;
