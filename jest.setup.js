require('dotenv').config({ path: '.env.test' });

const { sequelize } = require("./config/database");  
const { User, Gym, Review } = require("./models");

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
  await Gym.destroy({ where: {} }); 
  await Review.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});
