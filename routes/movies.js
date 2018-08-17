const express = require('express');
const {Movie,validate} = require('../modules/movie');
const {Genre} = require('../modules/genre');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Movie.find().sort({title: 1}));
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send(`The Movie with ID ${req.params.id} was not found!`);

    res.send(movie);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {title,genreId,numberInStock,dailyRentalRate} = req.body;
    const genre = await Genre.findById(genreId).select({name:1}); 
    if(!genre) return res.status(400).send('Invalid genre');

    let movie = new Movie({title,genre,numberInStock,dailyRentalRate});  
    
    movie = await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {title, genre,numberInStock,dailyRentalRate} = req.body;
    const movie = await Movie.findByIdAndUpdate(req.params.id, 
                        {title, genre,numberInStock,dailyRentalRate},
                        {new:true});
    if(!movie) return res.status(404).send(`Movie with Id ${req.params.id} was not found!`);
    
    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send(`Movie with Id ${req.params.id} was not found!`);

    res.send(movie);
});

module.exports = router;