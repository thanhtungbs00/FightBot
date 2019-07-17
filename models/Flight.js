const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
    flightId:String,
    src: String,
    dst: String,
    dtime: Date, 
    atime: Date,
    tseat: Number,
    bseat: Number
});

const Flight = mongoose.model('flights', FlightSchema);

module.exports = {
    Flight,
    FlightSchema
}