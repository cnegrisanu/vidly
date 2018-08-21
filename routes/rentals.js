const express = require('express');
const {Rental,validate} = require('../modules/rental');
const {Customer} = require('../modules/customer');
const {Movie} = require('../modules/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    res.send(await Rental.find().sort({dateOut: -1}));
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send(`The Rental with ID ${req.params.id} was not found!`);

    res.send(rental);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {customerId, movieId} = req.body;

    const customer = await Customer.findById(customerId).select({name:1,phone:1});
    if(!customer) return res.status(400).send('Invalid customer!');

    const movie = await Movie.findById(movieId).select({title:1, dailyRentalRate: 1, numberInStock:1 });
    if(!movie) return res.status(400).send('Invalid movie!');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock!');
 
    let rental = new Rental({customer,movie});
    
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id},{
                $inc:{numberInStock: -1}
            })
            .run();

        res.send(rental);
    } catch (err) {
        res.status(500).send('Something failed');
    }

    
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findByIdAndUpdate(req.params.id, 
                        {name: req.body.name},
                        {new:true});
    if(!rental) return res.status(404).send(`Rental with Id ${req.params.id} was not found!`);
    
    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental
    .findByIdAndRemove(req.params.id);
    if(!rental) return res.status(404).send(`Rental with Id ${req.params.id} was not found!`);

    const movie = await Movie.findByIdAndUpdate(rental.movie._id);
    movie.numberInStock++;
    movie.save();
    res.send(rental);
});

module.exports = router;