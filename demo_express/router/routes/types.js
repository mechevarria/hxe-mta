'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  const typesQuery = `
	SELECT DISTINCT TA_TYPE as "taType"
	FROM "$TA_EVENT.fti_notes";
  `;
  try {
    const results = [];
    req.db.exec(typesQuery).forEach(result => {
      results.push(result.taType);
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[types]: ${err.message}` });
  }
});

module.exports = router;