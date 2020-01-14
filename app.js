const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
// const session = require('express-session');
// const MongoClient = require('mongodb').MongoClient;

// Mongoose Promise
mongoose.Promise = global.Promise;

// Database configs
var config = {
    mongo: {
        hostString: '9a.mongo.evennode.com:27017,9b.mongo.evennode.com:27017/7326512cb1952073d6d9cc37635e5dcf',
        user: '7326512cb1952073d6d9cc37635e5dcf',
        db: '7326512cb1952073d6d9cc37635e5dcf',
        mongoPassword: 'TEDB10111'
    }
};

// mongodb://localhost:27017 for local DB
// Database Connection
mongoose
    .connect('mongodb://' + config.mongo.user + ':' + config.mongo.mongoPassword + '@' + config.mongo.hostString, {
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
const { select, genTime } = require('./helpers/handlebars-helpers');
app.engine('handlebars', handlebars({ defaultLayout: 'home', helpers: { select: select, genTime: genTime } }));
app.set('view engine', 'handlebars');

// Upload middleware
app.use(upload());

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method-OverRide
app.use(methodOverride('_method'));

// // Session
// app.use(
//     session({
//         secret: 'AdibTE',
//         resave: true,
//         saveUninitialized: true
//             // cookie: { secure: true }
//     })
// );

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
let port = process.env.PORT || 10;
app.listen(port, () => {
    console.log(`[ LISTENING ON PORT ${port} ]`);
});