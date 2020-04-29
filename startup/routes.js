const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const auth = require('../controller/auth');
const products = require('../controller/products');

const whitelist = ['description'];

module.exports = function(app) {
    app.use(helmet());
    app.use(express.json());
    app.use(mongoSanitize());
    app.use(xss());
    app.use(hpp({ whitelist: whitelist}));
    app.use('/api/auth', auth);
    app.use('/api/products', products);
}