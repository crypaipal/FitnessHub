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
    url: "postgresql://fitnesshub:857b41weq9kONfewj5bnum71TuBkygOW@dpg-cvhkhkdrie7s73e7klsg-a/db_fitnesshub",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
