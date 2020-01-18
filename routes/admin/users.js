const express = require('express');
const router = express.Router();
const { userAuth } = require('../../helpers/authUser');
const User = require('../../models/Admin/User');

// Set layout
router.all('/*', userAuth, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Index route
router.get('/', (req, res) => {
    User.find({}).then(users=>{
        res.render('admin/users',{users:users})
    })
});

module.exports = router;