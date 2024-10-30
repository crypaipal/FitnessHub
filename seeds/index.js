const Cities = require('../models/city');
const citiesData = require('./cities');
const { sequelize } = require('../config/database');
const { gymNames } = require("./gymHelpers");
const Gym = require('../models/gym');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await sequelize.sync();
    await Gym.destroy({ where: {} });
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 439);
        const price = Math.floor(Math.random() * 50) + 10;
        const gym = await Gym.create({
            location: `${citiesData[random1000].name}`,
            name: `${sample(gymNames)}`,
            image: `https://random.imagecdn.app/600/400`,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt itaque, ducimus saepe enim quidem illum nisi officiis totam natus alias labore nobis! Ipsum suscipit molestiae corporis minus dolorum iusto inventore?",
            price: price
        })
    }
}

seedDB().then(() => {
    sequelize.close();
});