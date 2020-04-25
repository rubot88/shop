
const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(
  rootDir,
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIdx = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIdx] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          if (err) throw err;
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          if (err) throw err;
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    })
  }
};