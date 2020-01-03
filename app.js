const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');

// Mongoose Promise
mongoose.Promise = global.Promise;

// Database Connection
mongoose
    .connect('mongodb://localhost:27017/CMS', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then((db) => {
        console.log('[ DB CONNECTED ]');
    })
    .catch((err) => {
        console.log('[ DB FAILD TO CONNECT ]');
    });

// Static /public
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
const { select } = require('./helpers/handlebars-helpers');
app.engine('handlebars', handlebars({ defaultLayout: 'home', helpers: { select: select } }));
app.set('view engine', 'handlebars');

// Upload middleware
app.use(upload());

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method-OverRide
app.use(methodOverride('_method'));

// Session
app.use(
    session({
        secret: 'AdibTE',
        resave: true,
        saveUninitialized: true
            // cookie: { secure: true }
    })
);

// Local variables using middlewares
app.use((req, res, next) => {
    // res.locals.success_message = req.flash('success_message');
    next();
});

// Load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

// Use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

// 404 route
app.get('*', function(req, res) {
    res.status(404);
    res.render('404');
});

// Listen port
app.listen(10, () => {
    console.log('[ LISTENING ON PORT 10 ]');
});