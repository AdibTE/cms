const express = require('express');
const router = express.Router();
const { userAuth, isAdmin } = require('../../helpers/authUser');
const User = require('../../models/Admin/User');
const UserType = require('../../models/Admin/UserType');

// Set layout
router.all('/*', userAuth, isAdmin, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// User Get route
router.get('/', (req, res) => {
    User.find({})
        .populate('type')
        .then((users) => {
            UserType.find({}).then((userTypes) => {
                res.render('admin/users', { users: users, userTypes: userTypes });
            });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// User Types get route
router.get('/types', (req, res) => {
    UserType.find({})
        .then((userTypes) => {
            res.render('admin/users/types', { userTypes: userTypes });
        })
        .catch((err) => {
            res.send(err.message);
        });
});

// User Types Create route
router.post('/types', (req, res) => {
    const vm = new UserType({
        type: req.body.type,
        name: req.body.name
    });
    vm
        .save()
        .then((s_vm) => {
            res.redirect('/admin/users/types');
        })
        .catch((err) => {
            req.flash('error_message', 'Id should be unique!');
            res.redirect('/admin/users/types');
            // res.send(err.message);
        });
});

// Edit User Type
router.patch('/edit/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        UserType.findOne({ type: req.body.type }).then((usertype) => {
            user.type = usertype;
            user
                .save()
                .then(() => {
                    req.flash('success_message', 'Succeess! User type updated');
                    res.redirect('/admin/users');
                })
                .catch((err) => {
                    res.send(err.message);
                });
        });
    });
});

module.exports = router;