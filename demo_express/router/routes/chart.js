'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  const donutQuery = `
	SELECT EVENT_TYPE as "eventType", COUNT(EVENT_TYPE) AS "count"
	FROM EVENT
	GROUP BY EVENT_TYPE;
  `;

  const barQuery = `
	SELECT COUNTRY_NAME as "countryName", COUNT(COUNTRY_NAME) AS "count"
	FROM EVENT
	GROUP BY COUNTRY_NAME; 
  `;

  try {
    const donutLabels = [];
    const donutData = [];
    req.db.exec(donutQuery).forEach(result => {
      donutLabels.push(result.eventType);
      donutData.push(result.count);
    });

    const barLabels = [];
    const barData = [{
      data: []
    }];
    req.db.exec(barQuery).forEach(result => {
      barLabels.push(result.countryName);
      barData[0].data.push(result.count);
    });

    res.json({
      'donutLabels': donutLabels,
      'donutData': donutData,
      'barLabels': barLabels,
      'barData': barData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `[chart]: ${err.message}` });
  }
});

module.exports = router;