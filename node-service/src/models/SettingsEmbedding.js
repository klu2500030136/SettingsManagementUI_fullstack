const mongoose = require('mongoose');

const SettingsEmbeddingSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  group: {
    type: String,
  },
  embedding: {
    type: [Number], // Array of numbers for vector search
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SettingsEmbedding', SettingsEmbeddingSchema);
