const moment = require('moment');
const bcrypt = require('bcryptjs');

module.exports = {
    select: (selected, options) => {
        return options.fn(this).replace(new RegExp('value="' + selected + '"'), '$&selected="selected"');
    },
    genTime: function(date, format) {
        return moment(date).format(format);
    },
    genSharp: function(data) {
        return data.replace(new RegExp('#', 'g'), '%23');
    },
    checkPage: function(page) {
        if (page >= 0) {
            return true;
        } else {
            return false;
        }
    },
    checkLastPage: function(page, length, limit) {
        if (page * limit < length) {
            return true;
        } else {
            return false;
        }
    },
    isAdmin: (type) => {
        if (parseInt(type) == 0) return true;
        else return false;
    }
};