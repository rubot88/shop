const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: "/products",
    });
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    })
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: "/",
    });
  })
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Shop Checkout',
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: "/orders",
  });
};