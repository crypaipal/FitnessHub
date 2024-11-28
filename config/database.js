const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbURL = process.env.DATABASE_URL || "postgres://postgres:2211@localhost:5432/fitnessHub"

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