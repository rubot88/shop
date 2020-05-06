const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
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
    const product = await Product.findOne({
      where: {
        id: prodId,
      },
    });

    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    })
  } catch (err) {
    console.log("Error: ", err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: "/",
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  const products = await cart.getProducts();

  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: "/cart",
    products,
  });
};

exports.postCart = async (req, res, next) => {
  try {
    const id = req.body.productId;
    let quantity = 1;
    const cart = await req.user.getCart();
    const [cartProduct] = await cart.getProducts({ where: { id } });
    if (cartProduct) {
      const oldQuantity = cartProduct.cartItem.quantity;
      quantity = oldQuantity + 1;
      await cart.addProduct(cartProduct, {
        through: {
          quantity,
        }
      })
    } else {
      const product = await Product.findByPk(id);
      await cart.addProduct(product, {
        through: {
          quantity,
        }
      })
    }
    res.redirect('/cart');
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const id = req.body.productId;
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id } });
    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (error) {
    console.log("Error: ", error);
  }
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