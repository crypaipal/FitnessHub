const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cities = sequelize.define('city', {
    name: {
        type: DataTypes.TEXT,
    },
    latitude: {
        type: DataTypes.DECIMAL
    },
    longitude: {
        type: DataTypes.DECIMAL
    }
});

module.exports = Cities;