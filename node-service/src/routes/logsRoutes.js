const express = require('express');
const router = express.Router();
const { getLogs, addLog } = require('../controllers/logsController');

router.route('/')
  .get(getLogs)
  .post(addLog);

module.exports = router;
