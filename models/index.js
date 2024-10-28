const Gym = require('./gym');
const User = require('./user');
const Review = require('./review');

Gym.hasMany(Review, { foreignKey: 'gymId' });
Review.belongsTo(Gym, { foreignKey: 'gymId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Gym, User, Review };