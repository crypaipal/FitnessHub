const citiesData = require('./cities');
const { sequelize } = require('../config/database');
const { gymNames } = require("./gymHelpers");
const { gymDescriptions } = require("./gymDescriptions");
const Gym = require('../models/gym');
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require('passport');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await sequelize.sync();
    await Gym.destroy({ where: {} });

    let users = await User.findAll();

    if (users.length === 0) {

        const hashedPasswords = await Promise.all([
            bcrypt.hash("123", 10),
            bcrypt.hash("123", 10),
            bcrypt.hash("123", 10),
        ]);

        await User.bulkCreate([
            { email: "malpa@gmail.com", username: "Malpa", password: hashedPasswords[0] },
            { email: "cry@gmail.com", username: "Cry", password: hashedPasswords[1] },
            { email: "matvey@gmail.com", username: "Maciej", password: hashedPasswords[2] },
        ]);

        users = await User.findAll();
    }

    for (let i = 0; i < 200; i++) {
        const randomCities = Math.floor(Math.random() * 347);
        const price = Math.floor(Math.random() * 50) + 10;
        const randomUser = sample(users);
        const description = sample(gymDescriptions);
        const selectedCity = citiesData[randomCities];

        await Gym.create({
            user_id: randomUser.id,
            location: `${selectedCity.name}`,
            name: `${sample(gymNames)}`,
            images: [{
                url: `https://images.unsplash.com/photo-1623874514711-0f321325f318?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D`,
                filename: `random_image_${i}`
            }],
            description: description,
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [selectedCity.longitude, selectedCity.latitude]
            }
        });
    }
};

seedDB().then(() => {
    sequelize.close();
});