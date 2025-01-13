require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: "postgresql://fitness_hub_qa58_user:DXyttKQspp6K3t64Jb5pC0V3ErgXNap2@dpg-cu2p0mogph6c73a8psp0-a/fitness_hub_qa58",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
