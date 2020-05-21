const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id
  }
  save() {
    const db = getDb();
    return db.collection('users')
      .insertOne(this);
  }

  addToCart(product) {
    const cartProductIdx = this.cart.items.findIndex(item => {
      return item.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIdx >= 0) {
      newQuantity = this.cart.items[cartProductIdx].quantity + 1;
      updatedCartItems[cartProductIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } })
  }

  async getCart() {
    try {
      const db = getDb();
      const productsIds = this.cart.items.map(item => item.productId);

      const products = await db.collection('products')
        .find({ _id: { $in: productsIds } }).toArray();
      return products.map(p =>
        ({
          ...p,
          quantity: this.cart.items
            .find(i => i.productId.toString() === p._id.toString())
            .quantity
        })
      )
    } catch (error) {
      throw error;

    }
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;