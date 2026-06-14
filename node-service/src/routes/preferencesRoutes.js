const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');

router.route('/:userId')
  .get(getPreferences)
  .put(updatePreferences);

module.exports = router;
