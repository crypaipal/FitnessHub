const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbURL = process.env.DATABASE_URL || "postgresql://fitness_hub_user:6tqikIhWHzaZIJRoMFuq8lyFDxb0XbW0@dpg-ct4b3na3esus73fei110-a/fitness_hub"

const sequelize = new Sequelize(dbURL, {
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the Database");
  } catch (error) {
    console.error("Error with connection to the Database", error);
  }
};

module.exports = { sequelize, connectDB };