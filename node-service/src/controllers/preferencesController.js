const UserPreference = require('../models/UserPreference');

// @route   GET /api/preferences-nosql/:userId
// @desc    Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ userId: req.params.userId });
    
    if (!preferences) {
      return res.status(404).json({ msg: 'Preferences not found' });
    }

    res.json(preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/preferences-nosql/:userId
// @desc    Update or create user preferences
exports.updatePreferences = async (req, res) => {
  const { theme, notificationsEnabled } = req.body;

  const prefFields = {};
  if (theme !== undefined) prefFields.theme = theme;
  if (notificationsEnabled !== undefined) prefFields.notificationsEnabled = notificationsEnabled;

  try {
    let preferences = await UserPreference.findOne({ userId: req.params.userId });

    if (preferences) {
      // Update
      preferences = await UserPreference.findOneAndUpdate(
        { userId: req.params.userId },
        { $set: prefFields },
        { new: true }
      );
      return res.json(preferences);
    }

    // Create
    prefFields.userId = req.params.userId;
    preferences = new UserPreference(prefFields);
    await preferences.save();
    res.json(preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
