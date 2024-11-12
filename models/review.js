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
    user_id: { // Dodanie pola klucza obcego
        type: DataTypes.INTEGER,
        references: {
            model: "users", // Odnosi się do tabeli User
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    }
});

module.exports = Review;
