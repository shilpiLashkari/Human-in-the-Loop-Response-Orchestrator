require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/incident-orchestrator';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB (Alert Stream)');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Routes
app.use('/api/alerts', alertRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Alert Ingestion' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Alert Ingestion Service running on port ${PORT}`);
});
