const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    source: { type: String, required: true }, // e.g., "Prometheus", "Sentry", "CloudWatch"
    alertId: { type: String, required: true }, // Unique ID from source
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical', 'fatal'],
        default: 'info'
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} }, // Arbitrary payload
    processed: { type: Boolean, default: false }, // If clustered into an incident
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', default: null }
});

module.exports = mongoose.model('Alert', AlertSchema);
