const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// GET /api/incidents - List all incidents
router.get('/', async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            order: [['updatedAt', 'DESC']]
        });
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
});

// GET /api/incidents/:id - Get specific incident
router.get('/:id', async (req, res) => {
    try {
        const incident = await Incident.findByPk(req.params.id);
        if (!incident) return res.status(404).json({ error: 'Incident not found' });
        res.json(incident);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch incident' });
    }
});

// POST /api/incidents/:id/action - Execute/Approve Action
// This will be called by the Frontend when user clicks "Approve"
router.post('/:id/action', async (req, res) => {
    const { action, approvedBy } = req.body;
    try {
        const incident = await Incident.findByPk(req.params.id);
        if (!incident) return res.status(404).json({ error: 'Incident not found' });

        // Update status
        await incident.update({
            actionStatus: 'approved', // Or 'executed' if we had the Execution service ready
            description: incident.description + `\n[${new Date().toISOString()}] Action '${action}' APPROVED by ${approvedBy}`
        });

        // Trigger Execution Hook (mocked for now)
        console.log(`⚡ EXECUTING ACTION: ${action} for Incident #${incident.id}`);

        res.json({ success: true, incident });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update incident action' });
    }
});

module.exports = router;
