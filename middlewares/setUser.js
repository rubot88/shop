const User = require('../models/user');

const setUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(1);
        await user.createCart();
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = setUser;