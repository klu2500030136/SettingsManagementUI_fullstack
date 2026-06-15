const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  theme: {
    type: String,
    default: 'system',
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);
