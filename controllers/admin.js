const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  })
};

exports.postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(null, title, imageUrl, price, description);
    await product.save();
    res.redirect('/');
  } catch (error) {
    console.log("Error: ", err);
  }
};

exports.getEditProduct = (req, res) => {
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findById(productId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product,
    })
  })

};


exports.postEditProduct = (req, res) => {
  const { id, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(id, title, imageUrl, price, description);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: "/admin/products",
    });
  })
}

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};