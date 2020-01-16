const express = require('express');
const router = express.Router();
const faker = require('faker');
const Category = require('../../models/Admin/Category');

// Set layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Index route
router.get('/', (req, res) => {
    Category.find({}).then((cat) => {
        res.render('admin/categories', { category: cat });
    });
});

// Create route
router.post('/create', (req, res) => {
    const newCat = Category();
    newCat.name = req.body.name;

    newCat
        .save()
        .then((sd) => {
            res.redirect('/admin/categories');
        })
        .catch((err) => {
            console.log(err);
        });
});

// Edit route
router.put('/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id }).then((cat) => {
        cat.name = req.body.newName;
        cat.save();
        res.redirect('/admin/categories');
    });
});

// Delete route
router.delete('/:id', (req, res) => {
    Category.findOne({ _id: req.params.id }).then((cat) => {
        cat.remove();
        res.redirect('/admin/categories');
    });
});

module.exports = router;