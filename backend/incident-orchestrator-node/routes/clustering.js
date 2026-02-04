const express = require('express');
const router = express.Router();
const AlertReader = require('../models/AlertReader');
const { clusterAlert } = require('../clustering/engine');

// POST /api/internal/process-alert
// Receive { alertId } from Ingestion Service
router.post('/', async (req, res) => {
    try {
        const { alertId } = req.body;
        if (!alertId) return res.status(400).json({ error: 'No alertId provided' });

        // 1. Fetch full alert details from MongoDB
        const alert = await AlertReader.findById(alertId);
        if (!alert) return res.status(404).json({ error: 'Alert not found in MongoDB' });

        // 2. Run Clustering Logic
        const incident = await clusterAlert(alert);

        // 3. Mark alert as processed in MongoDB (Optional, for housekeeping)
        alert.processed = true;
        await alert.save();

        // 4. (Future) Emit WebSocket Event here to notify Frontend immediately
        // For now, we just return success.

        res.json({ success: true, incidentId: incident.id });
    } catch (error) {
        console.error('Clustering Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
