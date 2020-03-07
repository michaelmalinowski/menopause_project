const port = 80;
const hostname = '127.0.0.1';

let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://google-home-mongodb:menopause@google-home-mongodb-xzvkn.gcp.mongodb.net/test?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to the database has been established');  
});

var user = new mongoose.Schema({
  name: String,
  apiKey: String,
  devices: Array,
  dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', user);  