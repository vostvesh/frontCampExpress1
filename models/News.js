const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  content: {
    type: String,
    require: true
  }
});

module.exports = NewsItem = mongoose.model('news', NewsSchema);
