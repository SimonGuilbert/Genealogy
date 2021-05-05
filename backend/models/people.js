var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PeopleSchema = new Schema({
  name : String
  },{ collection : 'people' });

module.exports = mongoose.model('People', PeopleSchema);