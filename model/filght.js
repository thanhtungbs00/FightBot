var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const flightSchema = new Schema({
    name: {
        type: String
    },
    date: {
        type: Number
    },
    returndate: {
        type: Number
    },
	from: {
		type: String
    },
    to: {
        type: String
    },
    category: {
        type: String
    }
});

module.exports = mongoose.model("Flight", flightSchema);

