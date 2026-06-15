const express = require('express');
const router = express.Router();
const { getEmbeddings, addEmbedding } = require('../controllers/embeddingsController');

router.route('/')
  .get(getEmbeddings)
  .post(addEmbedding);

module.exports = router;
