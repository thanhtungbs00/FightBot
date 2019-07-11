const mongoose = require('mongoose');
const { Card, Suggestion} = require('dialogflow-fulfillment');

// Make Reservation
function makeReservation(agent) {
    // mongoose.connect('mongodb://flightbot:flightbot123@ds349857.mlab.com:49857/heroku_1b2tvdth', { useNewUrlParser: true }).
    //     catch(error => handleError(error));
    agent.add('Here are some flight for you!');

    agent.add(new Card({
        title: 'Flight VN121',
        imageUrl: 'https://developers.google.com/actions/assistant.png',
        text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      })
    );

    agent.add(new Card({
        title: 'Flight VN122',
        imageUrl: 'https://developers.google.com/actions/assistant.png',
        text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      })
    );

    agent.add(new Card({
        title: 'Flight VN123',
        imageUrl: 'https://developers.google.com/actions/assistant.png',
        text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      })
    );
}

function selectFlight(agent) {
    agent.add(`Selected flight ${agent.parameters.flightname}`);
    agent.add(`Thank you so much`);
}

module.exports = {
    makeReservation,
    selectFlight
}