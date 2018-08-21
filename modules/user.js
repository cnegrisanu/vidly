const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    isAdmin: Boolean

});


userSchema.methods.generateAuthToken = function (){
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey')); 
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()
    }

    return Joi.validate(user,schema);
}


module.exports = {
    validate: validateUser,
    User: User,
    userSchema: userSchema,
    // generateAuthToken: generateAuthToken
}