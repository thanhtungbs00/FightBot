var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ticketSchema = new Schema({
	username: {
		type: String
    },
    email: {
        type: String
    },
    day: {
        type: Date
    },
	description: {
		type: String
    },
    passcode: {
        type: String
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);