const express = require('express');

const router = express.Router();

const genres = [{
    id: 1,
    name: 'Action'
},
{
    id: 2,
    name: 'Adventure'
},
{
    id: 3,
    name: 'Comedy'
},
{
    id: 4,
    name: 'Drama'
},
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {

    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Genre not found!')
    res.send(genre);
});

router.post('/', (req, res) => {
    if(!req.body.name) return res.status(400).send('ERROR: Request body is incorrect!');
    const name = req.body.name;
    const newGenre = {id:genres.length + 1, name: name};
    genres.push(newGenre);
    res.send(newGenre);
});

router.put('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Genre with Id ${req.params.id} was not found!`);

    genre.name =req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const index = genres.findIndex(g => g.id === parseInt(req.params.id));
    if(index < 0) return res.status(404).send('Genre not found!')

    genres.splice(index,1);
    res.status(201).send(genres);
});

module.exports = router;