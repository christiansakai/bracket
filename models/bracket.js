module.exports = function(m) {
  var mongoose = m || require('mongoose');
  var Schema = mongoose.Schema;

  var bracketSchema = new Schema({
    name: String,
    data: { type : Array , "default" : [] },
    round_scores: { type : Array , "default" : [0,0,0,0,0,0] },
    score: { type : Number , "default" : 0 },
    ptile: Number,
    winner: {
      sid: Number,
      name: String
    },
    code: String,
    year: {type: Number, default: 2014},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
  });

  return {model: mongoose.model('Bracket', bracketSchema)};
};
