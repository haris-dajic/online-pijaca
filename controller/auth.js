const { User, validate, createUser} = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const validateLogin = require('../middleware/validateLogin');


const router = express.Router();

router.post('/register', async (req, res) => {
    const {error} = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    let user = await User.findOne( { $or: [{ email: req.body.email}, { username: req.body.username}]});
    if(user) return res.status(400).send('User already registered.');

    user = createUser(req.body);
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('Authorization', token).send(_.pick(user, ['_id', 'username']));
});


router.post('/login', validateLogin, async(req, res) => {

    let user = await User.findOne({ username: req.body.username});
    if(!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) return res.status(400).send('Invalid username or password.');

    const token = user.generateAuthToken();
    res.send({'token': token});
});


module.exports = router;