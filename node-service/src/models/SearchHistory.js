const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: 'Unknown User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  resultsCount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
