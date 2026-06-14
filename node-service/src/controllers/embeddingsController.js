const SettingsEmbedding = require('../models/SettingsEmbedding');

// @route   GET /api/embeddings
// @desc    Get all settings embeddings
exports.getEmbeddings = async (req, res) => {
  try {
    const embeddings = await SettingsEmbedding.find();
    res.json(embeddings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/embeddings
// @desc    Add or update a settings embedding
exports.addEmbedding = async (req, res) => {
  const { settingKey, description, embedding } = req.body;

  try {
    let settingEmbedding = await SettingsEmbedding.findOne({ settingKey });

    if (settingEmbedding) {
      // Update
      settingEmbedding = await SettingsEmbedding.findOneAndUpdate(
        { settingKey },
        { $set: { description, embedding } },
        { new: true }
      );
      return res.json(settingEmbedding);
    }

    // Create
    const newEmbedding = new SettingsEmbedding({
      settingKey,
      description,
      embedding: embedding || [],
    });

    const savedEmbedding = await newEmbedding.save();
    res.json(savedEmbedding);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
