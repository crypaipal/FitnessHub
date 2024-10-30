const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gym = sequelize.define('gym', {
    name: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.REAL,
        defaultValue: 0.00
        // allowNull: false
    },
    rating: {
        type: DataTypes.REAL,
        // defaultValue: 0
    }
});

module.exports = Gym;
