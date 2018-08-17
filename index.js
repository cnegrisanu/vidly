const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

app.get('/', (req, res) => {
    res.send('WOW!!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}...`));