const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db.collection('products')
        .updateOne(
          { _id: this._id },
          { $set: this }
        );
    }
    return db.collection('products')
      .insertOne(this);
  }



  static fetchAll() {
    const db = getDb();
    return db.collection('products')
      .find().toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(id) }).next();
  }

};

module.exports = Product;