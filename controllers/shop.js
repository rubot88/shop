const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll();    
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
    const product = await Product.findById(prodId);
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
    const products = await Product.fetchAll();
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

exports.postOrder = async (req, res, next) => {
  try {
    const { user } = req;
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await user.createOrder();
    await order.addProducts(products.map(product => {
      product.orderItem = { quantity: product.cartItem.quantity }
      return product;
    }));
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { user } = req;
    const orders = await user.getOrders({ include: ['products'] });
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      orders,
      path: "/orders",
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};