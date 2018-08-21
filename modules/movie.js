const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');


const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        unique:true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required:true
    },
    numberInStock: {
        type: Number,
        min:0,
        max:255,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min:0,
        max:255,
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().default(0),
        dailyRentalRate: Joi.number().default(0)
    }

    return Joi.validate(movie,schema);
}

module.exports = {
    validate: validateMovie,
    Movie: Movie,
    movieSchema: movieSchema
}