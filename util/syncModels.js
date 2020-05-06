const sequelize = require('./database');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');



Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

const syncModels = async (isForce) => {
    await sequelize.sync({ force: !!isForce });
    const user = await User.findByPk(1);
    if (!user) {
        await User.create({ name: "Rustam", email: "rustam@gmail.com" });
    }
};

module.exports = syncModels;