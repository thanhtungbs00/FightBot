const mongoose = require('mongoose');
const { Card, Suggestion} = require('dialogflow-fulfillment');
const dateformat = require('dateformat');
const {Flight, FlightSchema} = require('../models/Flight');
const Ticket = require('../models/Ticket');


const timeFormat = "dd-mm-yyy h:MM:ss";

function randomNum(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

function findFlight(src, dst, time, callback) {
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
          var _flightId = 'VN' + randomNum(1000, 9999);
          var _dtime = new Date(time);
          _dtime.setHours(stime.getHours() + 3 + i*2);
          var _atime = new Date(_dtime);
          _atime.setHours(_dtime.getHours() + 1);
          var _tseat = randomNum(100, 200);
          var _bseat = randomNum(0, 100);
          var _fee = randomNum(500, 3000)*1000; 
          var _f = {flightId: _flightId, src: src, dst: dst, tseat: _tseat, bseat: _bseat, dtime: _dtime, atime: _atime, fee: _fee};
          flights.push(_f);
          var fObj = new Flight(_f);
          fObj.save((err, obj) => {
            if (err) {
              console.log(err);
            }
          })
        }
      }

      callback(flights);
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



    

    var callback = (flights) => {
      agent.context.set({
        'name': 'MakeReservation-followup',
        'lifespan': agent.context.get('makereservation-followup').lifespan + 1,
        'parameters': {
          ...agent.context.get('makereservation-followup').parameters,
          flights: flights,
          src: src,
          dst: dst,
          time: time
        }
      });

      for (var i = 0 ; i < flights.length; ++i) {
        var f = flights[i];
        var dtime = dateformat(f.dtime, timeFormat);
        var atime = dateformat(f.atime, timeFormat);
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
    return findFlight(src, dst, time, callback);
}

function selectFlightFallback(agent) {
  agent.add("Sorry. I don't understand your request");
}




function selectFlight(agent) {
    
    var flightId = agent.parameters.flightId.toUpperCase();
    console.log(agent.context);
    var flights = agent.context.get('makereservation-followup').parameters.flights;
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
    agent.context.set({
      'name': 'MakeReservation-followup',
      'lifespan': -1,
      'parameters': {
        ...agent.context.get('makereservation-followup').parameters
      }
    });
    // Show information, ask for confirmation
    var msg = `Flight ${chflight.flightId} will start at ${chflight.src} in ${dateformat(chflight.dtime, "yyyy-mm-dd h:MM:ss")} `
      + `and arrive at ${chflight.dst} in ${dateformat(chflight.atime, "yyyy-mm-dd h:MM:ss" )} \nFee: ${chflight.fee}`;
    agent.add(msg);

    agent.add(`Would you like to confirm this reservation?`);
    var params = [];
    if (agent.context.get('makereservation-selectnumber-followup') != undefined) {
      params = {...agent.context.get('makereservation-selectnumber-followup').parameters};
    }
    agent.context.set({
      'name': 'makereservation-selectnumber-followup',
      'lifespan': 2,
      'parameters': {...params, flightId: chflight.flightId}
    })
    agent.context.set({
      'name': 'MakeReservation-followup',
      'lifespan': -1,
      'parameters': {
        ...agent.context.get('makereservation-followup').parameters
      }
    });

} 

function confirmFlight(agent) {
  var context = agent.context.get('makereservation-selectnumber-followup');
  var flightId = 'emp';
  console.log(context);
  if (context != undefined) {
    flightId = context.parameters.flightId;
  }
  let tick = new Ticket({email: agent.parameters.email, day: new Date(), description: 'Empty', flightId: flightId});
  return tick.save().then((obj) => {
    agent.context.set({
      'name': 'makereservation-selectnumber-followup',
      'lifespan': -1
    })
    agent.add(`Confirmed. Your passcode is ${obj.passcode}`);
  }).catch(err => {
    console.log(err);
  })
  
  
}


function confirmFlightNo(agent) {
  // var flightId = agent.context.get('makereservation-followup').parameters.flightId;
  // var available_flights = agent.context.get('makereservation-followup').parameters.flights;
  agent.add('Cancelled. Thank you');
  agent.context.set({
    'name': 'makereservation-selectnumber-followup',
    'lifespan': -1
  })
  
}

function selectFlightRepeat(agent) {
  var params = agent.context.get('makereservation-followup').parameters;
  var src = params.flightdest;
  var dst = params.flightdest2;
  var time = params.date;
  return findFlight(agent, src, dst, time);
}


function setMappingReser(intentMap) {
  intentMap.set('Make Reservation', makeReservation);
  intentMap.set('Make Reservation - select.number', selectFlight)
  intentMap.set('Make Reservation - select.number - email', confirmFlight);
  intentMap.set('Make Reservation - select.number - no', confirmFlightNo);
  intentMap.set('Make Reservation - repeat', selectFlightRepeat);
}

module.exports = {
  setMappingReser,
  findFlight
}