const Incident = require('../models/Incident');
const { Op } = require('sequelize');
const axios = require('axios');


/**
 * Clustering Engine
 * Decides if an alert belongs to an existing incident or starts a new one.
 */
async function clusterAlert(alert) {
    console.log(`🧩 Clustering alert: ${alert._id} from ${alert.source}`);

    // 1. Find active incidents from the same source
    const existingIncident = await Incident.findOne({
        where: {
            status: { [Op.or]: ['active', 'investigating'] },
            source: alert.source
        }
    });

    if (existingIncident) {
        console.log(`🔗 Linking alert to existing incident #${existingIncident.id}`);

        // Update valid JSON array
        let currentAlerts = existingIncident.alertIds;
        if (typeof currentAlerts === 'string') currentAlerts = JSON.parse(currentAlerts);
        if (!Array.isArray(currentAlerts)) currentAlerts = [];

        currentAlerts.push(alert._id.toString());

        // Potential Severity Upgrade Logic
        let newSeverity = existingIncident.severity;
        if (alert.severity === 'critical') newSeverity = 'critical';

        await existingIncident.update({
            alertIds: currentAlerts,
            severity: newSeverity,
            description: existingIncident.description + `\n[${new Date().toISOString()}] New Alert: ${alert.message}`
        });

        return existingIncident;
    } else {
        console.log(`✨ Creating NEW incident for ${alert.source}`);

        // Call Django for Recommendation (Simulated AI)
        let recommendation = 'Investigate Logs';
        try {
            const recResponse = await axios.post('http://localhost:8000/api/recommend/', {
                description: alert.message,
                source: alert.source,
                incident_id: alert._id
            });
            if (recResponse.data && recResponse.data.recommendations.length > 0) {
                // Sort by confidence
                const best = recResponse.data.recommendations.sort((a, b) => b.confidence - a.confidence)[0];
                recommendation = best.action;
            }
        } catch (err) {
            console.error('⚠️ Recommendation Engine unavailable, using fallback.');
        }

        // Create new Incident
        const newIncident = await Incident.create({
            title: `Incident: ${alert.message}`,
            description: `Triggered by alert: ${alert.message}\nSource: ${alert.source}`,
            source: alert.source,
            severity: alert.severity || 'low',
            status: 'active',
            alertIds: [alert._id.toString()],
            recommendedAction: recommendation
        });

        // Notify WebSocket Hub
        try {
            await axios.post('http://localhost:3003/api/broadcast', {
                event: 'incident_created',
                data: newIncident
            });
        } catch (err) {
            console.error('⚠️ WebSocket Hub unavailable.');
        }

        return newIncident;
    }
}

module.exports = { clusterAlert };
