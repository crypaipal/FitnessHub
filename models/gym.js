const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gym = sequelize.define('gym', {
    name: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL,
        // allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    company: {
        type: DataTypes.STRING
    },
});

module.exports = Gym;
