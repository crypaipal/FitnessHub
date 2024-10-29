const Cities = require('../models/city');
const citiesData = require('./cities');
const { sequelize } = require('../config/database');
const { gymNames } = require("./gymHelpers");
const Gym = require('../models/gym');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Gym.destroy({ where: {} });
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 439);
        const gym = await Gym.create({
            location: `${citiesData[random1000].name}`,
            name: `${sample(gymNames)}`
        })
    }
}

seedDB().then(() => {
    sequelize.close();
});