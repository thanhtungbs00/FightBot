var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = new Schema({
    email: {
        type: String
    },
    day: {
        type: Date
    },
	description: {
		type: String
    },
    flightId: String,
    passcode: {
        type: Number
    }
});
ticketSchema.plugin(AutoIncrement, {id: 'unique_passcode', inc_field: 'passcode'});

module.exports = mongoose.model("Ticket", ticketSchema);