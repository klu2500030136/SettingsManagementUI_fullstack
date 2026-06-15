const SettingsEmbedding = require('../models/SettingsEmbedding');
const SearchHistory = require('../models/SearchHistory');
const embeddingService = require('../services/embeddingService');
const axios = require('axios');

// @route   POST /api/semantic-search
// @desc    Perform semantic search using MongoDB Atlas Vector Search
exports.semanticSearch = async (req, res) => {
  const { query, userName } = req.body;

  if (!query) {
    return res.status(400).json({ msg: 'Query is required' });
  }

  try {
    // 1. Generate Embedding for the User Query
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // 2. Perform MongoDB Vector Search
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
        },
      },
      {
        $project: {
          settingKey: 1,
          description: 1,
          group: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    const results = await SettingsEmbedding.aggregate(pipeline);

    // 3. Log Search History
    await SearchHistory.create({
      query,
      userName: userName || 'Unknown User',
      resultsCount: results.length,
    });

    res.json(results);
  } catch (err) {
    console.error('Semantic Search Error:', err);
    res.status(500).json({ error: 'Failed to perform semantic search' });
  }
};

// @route   GET /api/search-history
// @desc    Get semantic search activity history for logs
exports.getSearchHistory = async (req, res) => {
  try {
    const histories = await SearchHistory.find({
      userName: { $exists: true, $ne: 'Unknown User' },
    }).sort({ timestamp: -1 }).limit(100);

    const logs = histories.map((history) => {
      const timestamp = new Date(history.timestamp);

      return {
        id: history._id.toString(),
        user: history.userName || 'Unknown User',
        action: `Searched "${history.query}"`,
        category: 'Search',
        severity: 'Low',
        date: timestamp.toISOString().slice(0, 10),
        time: timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: timestamp.toISOString(),
      };
    });

    res.json(logs);
  } catch (err) {
    console.error('Search History Error:', err);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
};

// @route   POST /api/embeddings/sync
// @desc    Sync existing settings from Spring Boot and generate embeddings
exports.syncEmbeddings = async (req, res) => {
  try {
    const SPRING_SERVICE_URL = process.env.SPRING_SERVICE_URL || 'http://localhost:8001';
    
    // Extract Authorization header from incoming request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'No authorization token provided' });
    }

    // Fetch settings directly from Spring Boot, passing the auth token
    const response = await axios.get(`${SPRING_SERVICE_URL}/api/settings`, {
      headers: {
        Authorization: authHeader
      }
    });
    
    // Spring Boot returns ApiResponse<List<SettingResponse>> which is { message: "", data: [...] }
    const settings = response.data.data || response.data;

    let syncedCount = 0;

    for (const setting of settings) {
      // Use description for embedding, fallback to settingKey if description doesn't exist
      const textToEmbed = setting.description || setting.settingKey;
      const embedding = await embeddingService.generateEmbedding(textToEmbed);

      await SettingsEmbedding.findOneAndUpdate(
        { settingKey: setting.settingKey },
        { 
          description: textToEmbed, 
          group: setting.groupName || 'General',
          embedding 
        },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    res.json({ msg: `Successfully synchronized and embedded ${syncedCount} settings.` });
  } catch (err) {
    console.error('Sync Error:', err.message);
    res.status(500).json({ error: 'Failed to sync embeddings from Spring Boot' });
  }
};

// @route   POST /api/embeddings/seed
// @desc    Seed database with test settings if empty
exports.seedEmbeddings = async (req, res) => {
  try {
    const count = await SettingsEmbedding.countDocuments();
    if (count > 0) {
      return res.status(400).json({ msg: 'Database already contains settings.' });
    }

    const testSettings = [
      { key: 'notification_enabled', desc: 'Enable or disable application notifications globally.', group: 'Notifications' },
      { key: 'privacy_mode', desc: 'Controls privacy settings and restricts public profile visibility.', group: 'Privacy' },
      { key: 'data_sharing', desc: 'Allow sharing anonymous usage data with third parties for analytics.', group: 'Privacy' },
      { key: 'email_notifications', desc: 'Receive updates, marketing, and alerts via email.', group: 'Notifications' },
      { key: 'push_notifications', desc: 'Enable mobile or desktop push alerts for immediate updates.', group: 'Notifications' },
      { key: 'dark_mode', desc: 'Toggle the application UI theme between light and dark modes.', group: 'Appearance' },
    ];

    let seededCount = 0;
    for (const setting of testSettings) {
      const embedding = await embeddingService.generateEmbedding(setting.desc);
      await SettingsEmbedding.create({
        settingKey: setting.key,
        description: setting.desc,
        group: setting.group,
        embedding,
      });
      seededCount++;
    }

    res.json({ msg: `Successfully seeded ${seededCount} sample settings.` });
  } catch (err) {
    console.error('Seed Error:', err);
    res.status(500).json({ error: 'Failed to seed embeddings' });
  }
};
