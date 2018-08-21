// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const config = require('config');
const Joi = require('joi');
const error = require('./middleware/error');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
} ;

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}...`));