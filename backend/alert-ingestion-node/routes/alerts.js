const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const axios = require('axios');

// ORCHESTRATOR_URL - In a real setup, we might use a message queue (RabbitMQ/Kafka)
// For this MVP, we will directly Ping the Orchestrator after ingestion.
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:3002/api/internal/process-alert';

// POST /api/alerts - Receive a new alert
router.post('/', async (req, res) => {
    try {
        const { source, alertId, severity, message, metadata } = req.body;

        if (!source || !message) {
            return res.status(400).json({ error: 'Missing required fields: source, message' });
        }

        const newAlert = new Alert({
            source,
            alertId: alertId || `generated-${Date.now()}`,
            severity: severity || 'info',
            message,
            metadata
        });

        const savedAlert = await newAlert.save();
        console.log(`📥 Alert Ingested: [${savedAlert.severity}] ${savedAlert.message}`);

        // Notify Orchestrator asynchronously (dont await to keep ingestion fast)
        notifyOrchestrator(savedAlert);

        res.status(201).json({ message: 'Alert received', id: savedAlert._id });
    } catch (error) {
        console.error('Error processing alert:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function notifyOrchestrator(alert) {
    try {
        // Attempt to push to orchestrator
        await axios.post(ORCHESTRATOR_URL, { alertId: alert._id });
        // console.log('➡️ Processed signal sent to Orchestrator');
    } catch (err) {
        // It's okay if orchestrator is down, a background job would pick unprocessed alerts in a real system
        console.warn('⚠️ Could not notify Orchestrator immediately (is it running?)');
    }
}

module.exports = router;
