var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var mongoUri = 'mongodb://localhost/hackersbracket';

//process.env.MONGOLAB_URI ||  process.env.MONGOHQ_URL ||

mongoose.connect(mongoUri);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var models = require('./models/connect');

var teamObj = new models.Team({name: "Illinois"});
teamObj.save(function(err, savedteam) {
  if (err) {console.log(err);}
  console.log("saved team: " + savedteam.name);
  // callback();
});
