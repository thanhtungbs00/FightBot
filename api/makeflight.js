const mongoose = require('mongoose');
const { Card, Suggestion} = require('dialogflow-fulfillment');
const dateformat = require('dateformat');
const {Flight, FlightSchema} = require('../models/Flight');


function findFlight(agent, src, dst, time) {
  // Get flights from databases


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

  return Flight.find(query).then(
    (flights) => {
      // if empty -> Insert dummy data
      if (flights.length === 0) {
        for (var  i = 0  ; i < 5 ; ++i) {
          var _flightId = 'VN' + (Math.floor(Math.random() * 8999) + 1000);
          var _dtime = new Date(time);
          _dtime.setHours(stime.getHours() + 3 + i*2);
          var _atime = new Date(_dtime);
          _atime.setHours(_dtime.getHours() + 1);
          var _tseat = Math.floor(Math.random() * 100) + 100
          var _bseat = Math.floor(Math.random() * 100);
          var _f = {flightId: _flightId, src: src, dst: dst, tseat: _tseat, bseat: _bseat, dtime: _dtime, atime: _atime};
          flights.push(_f);
          var fObj = new Flight(_f);
          fObj.save((err, obj) => {
            if (err) {
              console.log(err);
            }
          })
        }
      }

      agent.setContext({
        'name': 'MakeReservation-followup',
        'lifespan': agent.getContext('makereservation-followup').lifespan + 1,
        'parameters': {
          ...agent.getContext('makereservation-followup').parameters,
          flights: flights,
          src: src,
          dst: dst,
          time: time
        }
      });


        for (var i = 0 ; i < flights.length; ++i) {
          var f = flights[i];
          var dtime = dateformat(f.dtime, "yyyy-mm-dd h:MM:ss");
          var atime = dateformat(f.atime, "yyyy-mm-dd h:MM:ss");
          if (i == 0) {
            agent.add('Here are some flight for you!');
          }
          
            agent.add(new Card({
              title: `Flight ${f.flightId}`,
              imageUrl: 'https://developers.google.com/actions/assistant.png',
              text: `${f.src} (${dtime}) -> ${f.dst} (${atime})`,
              buttonText: 'This is a button',
              buttonUrl: 'https://assistant.google.com/'
            })
          );
      }

      
    }
  ).catch( err => {
    console.log(err);
  });
}

// Make Reservation
function makeReservation(agent) {
    var src = agent.parameters.flightdest;
    var dst = agent.parameters.flightdest2;
    var time = agent.parameters.date;
    return findFlight(agent, src, dst, time);
    
    
}

function selectFlightFallback(agent) {
  agent.add("Sorry. I don't understand your request");
}

function selectFlight(agent) {
    
    var flightId = agent.parameters.flightId.toUpperCase();
    var flights = agent.getContext('makereservation-followup').parameters.flights;
    var valid = false;
    var chflight;
    for (var i = 0 ; i < flights.length ; ++i) {
      if (flights[i].flightId === flightId) {
        valid = true;
        chflight = flights[i]
      }
    }
    if (!valid) {
      return selectFlightFallback(agent);
    }
    agent.setContext({
      'name': 'MakeReservation-followup',
      'lifespan': -1,
      'parameters': {
        ...agent.getContext('makereservation-followup').parameters
      }
    });
    // TODO: Show information, ask for confirmation
    agent.add(`Select flight ${chflight.flightId}`);
    agent.add(`Flight will start at ${chflight.src} in ${dateformat(chflight.dtime, "yyyy-mm-dd h:MM:ss")} and arrive at ${chflight.dst} in ${dateformat(chflight.atime, "yyyy-mm-dd h:MM:ss")}`);
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

function selectFlightRepeat(agent) {
  var params = agent.getContext('makereservation-followup').parameters;
  var src = params.flightdest;
  var dst = params.flightdest2;
  var time = params.date;
  return findFlight(agent, src, dst, time);
}


function setMappingReser(intentMap) {
  intentMap.set('Make Reservation', makeReservation);
  intentMap.set('Make Reservation - select.number', selectFlight)
  intentMap.set('Make Reservation - select.number - yes', confirmFlight);
  intentMap.set('Make Reservation - select.number - no', confirmFlightNo);
  intentMap.set('Make Reservation - repeat', selectFlightRepeat);
}

module.exports = {
  setMappingReser
}