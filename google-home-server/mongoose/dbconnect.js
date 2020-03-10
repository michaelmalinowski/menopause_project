const port = 80;
const hostname = '127.0.0.1';

let mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongodb_connection = process.env.MONGODB_CONNECTION;

mongoose.connect(mongodb_connection, 
{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to the database has been established');  
});

var user = new mongoose.Schema({
  name: String,
  apiKey: String,
  devices: [{
    name: String,
    characteristics: [{
      property: String,
      value: String
    }]
  }],
  dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', user);  