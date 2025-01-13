const { Sequelize } = require('sequelize');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  dialectOptions: dbConfig.dialectOptions || {},
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to the Database (${env})`);
  } catch (error) {
    console.error(`Error with connection to the Database (${env})`, error);
  }
};

module.exports = { sequelize, connectDB };