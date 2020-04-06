const mongoose = require('mongoose');
const { userSchema } = require('./user');
const Joi = require('joi');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        maxlength: 255
    },

    price: Number,
    
    description: {
        type: String,
        min: 0,
        maxlength: 2000
    },

    userId: {
        type: String,
        required: true
    },

    productPictures: {
        type: [String],
        maxlength: 3,
        default: 'productDefault.jpg'
    }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(2).max(255).required(),
        price: Joi.number().min(0),
        description: Joi.string().min(0).max(2000),
        productPictures: Joi.optional()
    }
    return Joi.validate(product, schema);
}

function createProduct(product) {
    return new Product({
        name: product.name,
        price: product.price,
        description: product.description,
        productPictures: product.productPictures,
        userId: product.userId
    });
}


module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.createProduct = createProduct;
