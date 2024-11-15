const citiesData = require('./cities');
const { sequelize } = require('../config/database');
const { gymNames } = require("./gymHelpers");
const Gym = require('../models/gym');
const User = require("../models/user");

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await sequelize.sync();
    await Gym.destroy({ where: {} });

    const users = await User.findAll();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 439);
        const price = Math.floor(Math.random() * 50) + 10;
        const randomUser = sample(users);
        const gym = await Gym.create({
            user_id: randomUser.id,
            location: `${citiesData[random1000].name}`,
            name: `${sample(gymNames)}`,
            images: [{ url: `https://random.imagecdn.app/600/400`, filename: `random_image_${i}` }],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt itaque, ducimus saepe enim quidem illum nisi officiis totam natus alias labore nobis! Ipsum suscipit molestiae corporis minus dolorum iusto inventore?",
            price: price
        })
    }
}

seedDB().then(() => {
    sequelize.close();
});