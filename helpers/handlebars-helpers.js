const moment = require('moment');

module.exports = {
    select: (selected, options) => {
        return options.fn(this).replace(new RegExp('value="' + selected + '"'), '$&selected="selected"');
    },
    genTime: function(date, format) {
        return moment(date).format(format);
    },
    genSharp: function(data) {
        return data.replace(new RegExp('#', 'g'), '%23');
    }
};