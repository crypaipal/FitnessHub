const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gym = sequelize.define('gym', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.00,
        allowNull: false
    },
    author_id: { // Dodanie pola klucza obcego
        type: DataTypes.INTEGER,
        references: {
            model: "users", // Odnosi się do tabeli User
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    }
});

module.exports = Gym;
