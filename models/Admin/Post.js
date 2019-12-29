const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  status: {
    type: String,
    default: 'public'
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  allowComments: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("post", postSchema);
