const Cities = require('../models/city'); // Import modelu Cities
const citiesData = require('./cities'); // Import listy miast
const { sequelize } = require('../config/database');
const Gym = require('../models/gym');

const seedDB = async () => {
    await Gym.destroy({ where: {} });
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 439);
        const gym = await Gym.create({
            location: `${citiesData[random1000].name}`
        })
    }
}

seedDB();