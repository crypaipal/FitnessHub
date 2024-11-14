const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('review', {
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    gym_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'gyms',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    }
});

module.exports = Review;
