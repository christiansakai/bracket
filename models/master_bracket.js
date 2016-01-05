module.exports = function(m) {
  var mongoose = m || require('mongoose');
  var Schema = mongoose.Schema;

  var bracketSchema = new Schema({
    data: { type : Array , "default" : [] },
    year: { type: Number, default: 2014 }
  });

  return {model: mongoose.model('MasterBracket', bracketSchema)};
};
