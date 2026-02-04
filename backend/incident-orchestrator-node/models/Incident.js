const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Incident = sequelize.define('Incident', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'investigating', 'remediated', 'closed'),
        defaultValue: 'active'
    },
    severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'low'
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alertIds: {
        type: DataTypes.JSON, // Array of MongoDB Alert IDs
        defaultValue: []
    },
    recommendedAction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    actionStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'executed', 'failed'),
        defaultValue: 'pending'
    }
});

module.exports = Incident;
