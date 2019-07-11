const mongoose = require('mongoose');

// Make Reservation
function makeReservation(agent) {
    // mongoose.connect('mongodb://flightbot:flightbot123@ds349857.mlab.com:49857/heroku_1b2tvdth', { useNewUrlParser: true }).
    //     catch(error => handleError(error));
    agent.add('Here are some flight for you!');
}

module.exports = {
    makeReservation
}