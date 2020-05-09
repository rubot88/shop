const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const syncModels = require('./util/syncModels');
const setUser = require('./middlewares/setUser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(setUser);

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

syncModels()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log('Error:', err);
    });