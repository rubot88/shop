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
    const { title, price, description, imageUrl } = req.body;
    const product = new Product(title, price, description, imageUrl);
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = async (req, res) => {
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect('/');
  }
  try {
    const id = req.params.productId;
    const product = await Product
      .findById(id);
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product,
    })
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { title, price, description, imageUrl, id } = req.body;
    const product = new Product(
      title,
      price,
      description,
      imageUrl,
      id
    );
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: "/admin/products",
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}

// exports.postDeleteProduct = async (req, res) => {
//   const id = req.body.productId;
//   try {
//     await Product.destroy({ where: { id } });
//     res.redirect('/admin/products');
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// };