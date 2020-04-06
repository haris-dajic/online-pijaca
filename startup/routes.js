const express = require('express');

const auth = require('../controller/auth');
const products = require('../controller/products');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/products', products);
}