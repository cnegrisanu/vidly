const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    }

});
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).max(50).required()
    }

    return Joi.validate(genre,schema);
}

module.exports = {
    validate: validateGenre,
    Genre: Genre,
    genreSchema: genreSchema
}