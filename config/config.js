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
    url: "postgresql://fitness_hub_8ir2_user:prpKH8lElTd348lBZNytWt2wVtatShWV@dpg-cuvm5d5ds78s73cniv10-a/fitness_hub_8ir2",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
