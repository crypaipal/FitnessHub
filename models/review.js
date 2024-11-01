const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('review', {
    rating: {
        type: DataTypes.DECIMAL,
        // allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
    },
    gym_id: {  // Klucz obcy do modelu Gym
        type: DataTypes.INTEGER,
        references: {
            model: 'gyms',  // Nazwa tabeli Gym
            key: 'id'
        },
        // onDelete: 'CASCADE' // Opcja usunięcia powiązanych recenzji po usunięciu siłowni
    }
});

module.exports = Review;
