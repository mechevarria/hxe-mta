'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  const analysisQuery = `
	SELECT "TA_COUNTER" AS "count", 
		"TA_TOKEN" AS "token"
	FROM "$TA_EVENT.fti_notes"
	WHERE TA_TYPE = ?
	ORDER BY TA_COUNTER DESC
	LIMIT ?;
  `;
  const type = req.query.type || '';
  const limit = req.query.limit || 30;

  try {
    const results = [];
    req.db.exec(analysisQuery, [type, limit]).forEach(result => {
      results.push({
        'text': result.token,
        'weight': result.count
      });
    });

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `[analysis]: ${err.message}`
    });
  }

});

module.exports = router;