module.exports = function(m) {
  var mongoose = m || require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.Types.ObjectId;

  var groupSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    password: String,
    owner: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    year: {type: Number, default: 2014}
  });

  return {model: mongoose.model('Group', groupSchema)};
};
