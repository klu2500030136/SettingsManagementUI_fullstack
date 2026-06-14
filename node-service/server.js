const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/logs', require('./src/routes/logsRoutes'));
app.use('/api/preferences-nosql', require('./src/routes/preferencesRoutes'));
app.use('/api/embeddings', require('./src/routes/embeddingsRoutes'));
app.use('/api', require('./src/routes/searchRoutes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Node.js Microservice Running' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
