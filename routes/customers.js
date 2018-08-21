const express = require('express');
const {Customer, validate} = require('../modules/customer');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await Customer.find().sort({name: 1}));
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(`The Customer with ID ${req.params.id} was not found!`);

    res.send(customer);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name,phone,isGold} = req.body;
    const customer = new Customer({phone,isGold,name});
    await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name,phone,isGold} = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id,
                            {name,phone,isGold},
                            {new:true});
    
    if(!customer) return res.status(404).send(`Customer with Id ${req.params.id} was not found!`);
    
    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send(`Customer with Id ${req.params.id} was not found!`);

    res.send(customer);
});

module.exports = router;