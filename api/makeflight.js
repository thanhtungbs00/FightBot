const mongoose = require('mongoose');
const { Card, Suggestion} = require('dialogflow-fulfillment');
const dateformat = require('dateformat');
const {Flight, FlightSchema} = require('../models/Flight');

// Make Reservation
function makeReservation(agent) {
    var lstFlights = ['VN123'.toLowerCase(), 'VN122'.toLowerCase(), 'VN124'.toLowerCase()];
    var src = agent.parameters.flightdest;
    var dst = agent.parameters.flightdest2;
    var time = agent.parameters.date;

    agent.setContext({
      'name': 'MakeReservation-followup',
      'lifespan': agent.getContext('makereservation-followup').lifespan,
      'parameters': {
        ...agent.getContext('makereservation-followup').parameters,
        flights: lstFlights,
        src: src,
        dst: dst,
        time: time
      }
    });

    var stime = new Date(time);
    stime.setHours(stime.getHours());
    var etime = new Date(time);
    etime.setHours(stime.getHours() + 24); 

    var query = {src: src,
      dst: dst, 
      dtime: {
        $gte: stime,
        $lt:  etime
      }
    };

    console.log(query);

    Flight.find(query, (error, flights) => {
      console.log(flights);
    })



    agent.add('Here are some flight for you!');
    for (num in lstFlights) {
      agent.add(new Card({
        title: `Flight ${lstFlights[num].toUpperCase()}`,
        imageUrl: 'https://developers.google.com/actions/assistant.png',
        text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      })
    );

    }
}

function selectFlight(agent) {
    
    var flightId = agent.parameters.flightId;
    agent.setContext({
      'name': 'MakeReservation-followup',
      'lifespan': -1,
      'parameters': {
        ...agent.getContext('makereservation-followup').parameters
      }
    });
    var params = agent.getContext('makereservation-followup').parameters;
    // TODO: Show information, ask for confirmation
    agent.add(`Select flight ${flightId}`);
    agent.add(`Flight ${flightId} will start at {} at ${params.src} and arrive at ${params.dst} in ${params.time}`);
    agent.add(`Would you like to confirm this reservation?`);
    agent.setContext({
      'name': 'MakeReservation-followup',
      'lifespan': -1,
      'parameters': {
        ...agent.getContext('makereservation-followup').parameters
      }
    });

} 

function confirmFlight(agent) {
  // var flightId = agent.getContext('makereservation-followup').parameters.flightId;
  // var available_flights = agent.getContext('makereservation-followup').parameters.flights;
  agent.add('Confirmed. Thank you');
  agent.setContext({
    'name': 'makereservation-selectnumber-followup',
    'lifespan': -1
  })
  
}


function confirmFlightNo(agent) {
  // var flightId = agent.getContext('makereservation-followup').parameters.flightId;
  // var available_flights = agent.getContext('makereservation-followup').parameters.flights;
  agent.add('Cancelled. Thank you');
  agent.setContext({
    'name': 'makereservation-selectnumber-followup',
    'lifespan': -1
  })
  
}


function setMappingReser(intentMap) {
  intentMap.set('Make Reservation', makeReservation);
  intentMap.set('Make Reservation - select.number', selectFlight)
  intentMap.set('Make Reservation - select.number - yes', confirmFlight);
  intentMap.set('Make Reservation - select.number - no', confirmFlightNo);
}

module.exports = {
  setMappingReser
}