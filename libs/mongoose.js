var mongoose    = require('mongoose');
//var log         = require('./log')(module);
//var config      = require('./config');

var dbName = 'sampledb';

var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

/*mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + dbName;

if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}*/


var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function (err) {
    console.error('connection error:', err.message);
});

db.once('open', function callback () {
    console.info("Connected to DB!");
});

var Schema = mongoose.Schema;

var PriceHistory  = new Schema({
    price: { type: Number, required: true },
    date: {type: Date } 
});

var Card  = new Schema({
    id: { type: Number, required: true },
    price: { type: Number, required: true },
    rarity: {type: String, enum: ['c', 'u', 'r', 'm', 's'] },
    setId: { type: String, required: true },
    title: { type: String, required: true },
    titleRus: { type: String },
    priceHistory: [PriceHistory]
});

var CardSet = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    cards: [Card]
});


var CardSetModel = mongoose.model('CardSet', CardSet);

module.exports.CardSetModel = CardSetModel;