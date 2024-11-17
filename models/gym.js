const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gym = sequelize.define('gym', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images:
    {
        type: DataTypes.JSON,
        defaultValue: []
    },
    geometry: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
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
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    }
}, {
    getterMethods: {
        thumbnail() {
            if (this.images && this.images.length > 0) {
                return this.images.map(image => {
                    return {
                        ...image,
                        thumbnailUrl: image.url.replace("/upload", "/upload/w_150")
                    };
                });
            }
            return [];
        }
    }
});

module.exports = Gym;