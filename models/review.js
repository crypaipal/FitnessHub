const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('review', {
    rating: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
    },
});

module.exports = Review;
