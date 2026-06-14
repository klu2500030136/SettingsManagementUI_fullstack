const express = require('express');
const router = express.Router();
const { semanticSearch, getSearchHistory, syncEmbeddings, seedEmbeddings } = require('../controllers/searchController');

router.post('/semantic-search', semanticSearch);
router.get('/search-history', getSearchHistory);
router.post('/embeddings/sync', syncEmbeddings);
router.post('/embeddings/seed', seedEmbeddings);

module.exports = router;
