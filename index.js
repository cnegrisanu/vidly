const express = require('express');

const app = express();

app.use(express.json());

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


app.get('/', (req, res) => {
    res.send('WOW!!');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {

    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Genre not found!')
    console.log(genre);
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    if(!req.body.name) return res.status(400).send('ERROR: Request body is incorrect!');
    const name = req.body.name;
    const newGenre = {id:genres.length + 1, name: name};
    genres.push(newGenre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Genre with Id ${req.params.id} was not found!`);

    genre.name =req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const index = genres.findIndex(g => g.id === parseInt(req.params.id));
    if(index < 0) return res.status(404).send('Genre not found!')

    genres.splice(index,1);
    res.status(201).send(genres);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}...`));