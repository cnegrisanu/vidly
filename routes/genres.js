const express = require('express');
const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const {Genre,validate} = require('../modules/genre');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Genre.find().sort({name: 1}));
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`The Genre with ID ${req.params.id} was not found!`);

    res.send(genre);
});

router.post('/', auth, asyncMiddleware(async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    await genre.save();

    res.send(genre);
}));

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, 
                        {name: req.body.name},
                        {new:true});
    if(!genre) return res.status(404).send(`Genre with Id ${req.params.id} was not found!`);
    
    res.send(genre);
});

router.delete('/:id', [auth,admin], async (req, res) => {
    const genre = await Genre
    .findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send(`Genre with Id ${req.params.id} was not found!`);

    res.send(genre);
});

module.exports = router;