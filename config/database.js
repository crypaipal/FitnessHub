const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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