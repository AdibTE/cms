const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { mongoDbUrl } = require('./config/database');
const passport = require('passport');

// Mongoose Promise
mongoose.Promise = global.Promise;

// Database Connection
mongoose
    .connect(mongoDbUrl, {
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
const { select, genTime, genSharp, checkPage, checkLastPage, isAdmin } = require('./helpers/handlebars-helpers');
app.engine(
    'handlebars',
    handlebars({
        defaultLayout: 'home',
        helpers: {
            select: select,
            genTime: genTime,
            genSharp: genSharp,
            checkPage: checkPage,
            checkLastPage: checkLastPage,
            isAdmin: isAdmin
        }
    })
);
app.set('view engine', 'handlebars');

// Upload middleware
app.use(upload());

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method-OverRide
app.use(methodOverride('_method'));

// Flash messagin
app.use(cookieParser());
app.use(
    session({
        secret: 'adibte',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash());

// Passport Auth
app.use(passport.initialize());
app.use(passport.session());

// Local variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.success_alert = req.flash('success_alert');
    res.locals.error_alert = req.flash('error_alert');
    res.locals.error = req.flash('error');
    next();
});

// Load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const users = require('./routes/admin/users');
const comments = require('./routes/admin/comments');

// Use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/users', users);
app.use('/admin/comments', comments);

// 404 route
app.get('*', function(req, res) {
    res.status(404);
    res.render('404');
});

// Listen port
let port = process.env.PORT || 10;
app.listen(port, () => {
    console.log(`[ LISTENING ON PORT ${port} ]`);
});