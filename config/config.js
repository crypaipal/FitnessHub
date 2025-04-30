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
    url: "postgresql://fitness_hub_5o4l_user:HO45OfLxytGSghsNQTrBuIfK3BVL3khk@dpg-d08t0l95pdvs739s01n0-a.frankfurt-postgres.render.com/fitness_hub_5o4l",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
