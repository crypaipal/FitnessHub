const Gym = require('./gym');
const User = require('./user');
const Review = require('./review');

Gym.hasMany(Review, { foreignKey: 'gym_id' });
Review.belongsTo(Gym, { foreignKey: 'gym_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Gym.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Gym, { foreignKey: 'user_id' });

module.exports = { Gym, User, Review };