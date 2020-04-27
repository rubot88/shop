const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res) => {
  try {
    const [products] = await Product.fetchAll();
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: "/products",
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const [product] = await Product.findById(prodId);
    console.log('product', product);

    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product.title,
      path: '/products'
    })
  } catch (err) {
    console.log("Error: ", err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const [products, fieldData] = await Product.fetchAll();
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: "/",
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      products.forEach(product => {
        const cartProduct = cart.products.find(p => product.id === p.id);
        if (cartProduct) {
          cartProducts.push({ product, qty: cartProduct.qty });
        }
      });
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: "/cart",
        products: cartProducts,
      });
    });
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  })

  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('cart');
  })
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