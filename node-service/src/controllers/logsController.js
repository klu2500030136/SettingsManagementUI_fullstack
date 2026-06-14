const ConfigurationLog = require('../models/ConfigurationLog');

// @route   GET /api/logs
// @desc    Get all configuration logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await ConfigurationLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/logs
// @desc    Add new configuration log
exports.addLog = async (req, res) => {
  const { user, action, entity } = req.body;

  try {
    const newLog = new ConfigurationLog({
      user,
      action,
      entity,
    });

    const log = await newLog.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
