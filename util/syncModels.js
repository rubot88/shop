const sequelize = require('./database');
const User = require('../models/user');

const syncModels = async (isForce) => {
    await sequelize.sync({ force: !!isForce });
    const user = await User.findByPk(1);
    if (!user) {
        await User.create({ name: "Rustam", email: "rustam@gmail.com" });
    }
};

module.exports = syncModels;