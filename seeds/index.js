const citiesData = require('./cities');
const { sequelize } = require('../config/database');
const { gymNames } = require("./gymHelpers");
const { gymDescriptions } = require("./gymDescriptions");
const Gym = require('../models/gym');
const User = require("../models/user");

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await sequelize.sync();
    await Gym.destroy({ where: {} });

    const users = await User.findAll();

    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 347);
        const price = Math.floor(Math.random() * 50) + 10;
        const randomUser = sample(users);
        const description = sample(gymDescriptions);
        const selectedCity = citiesData[random1000];

        const gym = await Gym.create({
            user_id: randomUser.id,
            location: `${citiesData[random1000].name}`,
            name: `${sample(gymNames)}`,
            images: [{ url: `https://images.unsplash.com/photo-1623874514711-0f321325f318?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D`,
             filename: `random_image_${i}` }],
            description: description,
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [selectedCity.longitude, selectedCity.latitude]
            }
        });
    }
}

seedDB().then(() => {
    sequelize.close();
});