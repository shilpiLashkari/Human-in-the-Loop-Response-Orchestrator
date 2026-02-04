const mongoose = require('mongoose');

// Helper model to read the alerts collection created by the Ingestion service
// We don't write to it here, just read.
const AlertSchema = new mongoose.Schema({
    source: String,
    severity: String,
    message: String,
    timestamp: Date,
    processed: Boolean
}, { collection: 'alerts' }); // Explicitly match the collection name

module.exports = mongoose.model('AlertReader', AlertSchema);
