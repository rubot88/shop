const User = require('../models/user');

const setUser = async (req, res, next) => {
    try {
        const { username, email, cart, _id } = await User.findById('5ec4ba4c53b435267ccd8ea2');
        // await user.createCart();
        req.user = new User(username, email, cart, _id);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = setUser;