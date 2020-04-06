const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const { Product, validate, createProduct } = require('../models/product');
const { User } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();



router.get('/all', async (req, res) => {
    const products = await Product.find();
    return res.send(products);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) 
        return res.status(404).send("The product with the given ID was not found.");
    
    res.send(product);
});

router.post('/add', auth,  async (req, res) => {
    const { error} = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const user = await User.findById({ _id: req.user._id });
    if(!user) return res.status(400).send('Invalid user.');

    req.body.userId = user._id;

    const product = createProduct(req.body);
    await product.save();

    res.send(product);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body);
    const product = await Product
        .findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, 
        {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            productPictures: req.body.productPictures
        }, 
        { new: true});

    if(!product) 
        return res.status(400).send('The product with the given ID was not found.');
    res.send(product);
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {

    const product = await Product.findByIdAndRemove({ _id: req.params.id});
    if(!product) 
        return res.status(400).send('The product with the given ID was not found.');

    res.send(product);
});


module.exports = router;