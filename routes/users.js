const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const {User,validate} = require('../modules/user');
const _ = require('lodash');

const router = express.Router();


router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id).select({password: 0});
    res.send(user);
});

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
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({_id,name,email});

});


module.exports = router;