const express = require('express');
const bcrypt = require('bcrypt');
const {User,validate} = require('../modules/user');
const _ = require('lodash');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let {name, email, password} = req.body;
     
    password =  await bcrypt.hash(password, 10);

    let user = User.findOne({email: req.body.email});
    if(user.email) return res.status(400).send('User already registered!');

    user = new User({name, email, password});

    await user.save();
    const {_id} = user;
    res.send({_id,name,email});

    //lodash can be used instead of ES6 deconstruction, but I prefer it.
    // res.send(_.pick(user,['_id','name','email']));

});


module.exports = router;