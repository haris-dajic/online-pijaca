const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        validate: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        validate: /^[a-zšđčćžA-ZŠĐČĆŽ]+(([',. -][a-zA-ZŽĐĆČŠ ])?[a-zA-ZŽĆČŠĐ]*)*$/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Korisničko ime treba da ima barem 5 karaktera.'],
        maxlength: [255, 'Korisničko ime može da ima najviše 255 karaktera.'],
        validate: /^[a-z0-9_-]{5,255}$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'root-admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true, 
        minlength: 8, 
        maxlength: 1024
    },
    userPicture: {
        type: String,
        default: 'default.jpg'
    }
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, role: this.role}, config.get('jwtPrivateKey'), {
        expiresIn: config.get('JWT_EXPIRES_IN')
      });

      
};


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        username: Joi.string().min(5).max(255).required(),
        email:  Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        role: Joi.string().min(8).max(255)
    }
    return Joi.validate(user, schema);
}

function createUser(user) {
    return new User({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        password: user.password,
        userPicture: user.userPicture,
    });
}



module.exports.User = User;
module.exports.validate = validateUser;
module.exports.createUser = createUser;
module.exports.userSchema = userSchema;