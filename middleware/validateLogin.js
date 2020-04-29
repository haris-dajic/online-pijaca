const Joi = require('joi');

module.exports = function (req, res, next) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    }
    const result = Joi.validate(req.body, schema);
    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    next();
}
