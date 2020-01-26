const Post = require('../models/Admin/Post');

module.exports = {
    userAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    isAdmin: function(req, res, next) {
        if (parseInt(req.user.type.type) == 0) return next();
        else res.render('partials/admin/restrict');
    },
    isOwner: function(req, res, next) {
        Post.findOne({ _id: req.params.id }).populate('user').then((post) => {
            if (req.user._id.toString() === post.user._id.toString() || parseInt(req.user.type.type) == 0)
                return next();
            else res.render('partials/admin/restrict');
        });
    }
};