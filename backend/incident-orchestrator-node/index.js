require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const sequelize = require('./database');
const Incident = require('./models/Incident');
const clusteringRoutes = require('./routes/clustering');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. Connect to MongoDB (for reading Alerts)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/incident-orchestrator';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB (Alert Stream)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 2. Connect to SQLite (for Incident Lifecycle)
sequelize.sync()
    .then(() => console.log('✅ SQLite Database Synced (Incidents)'))
    .catch(err => console.error('❌ SQLite/Sequelize Error:', err));

// Routes
app.use('/api/internal/process-alert', clusteringRoutes);
app.use('/api/incidents', require('./routes/incidents'));

app.listen(PORT, () => {
    console.log(`🚀 Incident Orchestrator running on port ${PORT}`);
});
