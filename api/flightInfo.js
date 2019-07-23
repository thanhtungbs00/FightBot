const mongoose = require('mongoose');
const { Card, Suggestion} = require('dialogflow-fulfillment');
const dateformat = require('dateformat');
const {Flight, FlightSchema} = require('../models/Flight');
const Ticket = require('../models/Ticket');


function getFlightInfo(agent) {
    var callback = (chTicket, chflight) => {
        var msg = "Can't find your ticket information. Please try again";
        if (chflight) {
            if (chTicket) {
                var msg = `Flight ${chflight.flightId} will start at ${chflight.src} in ${dateformat(chflight.dtime, "yyyy-mm-dd h:MM:ss")} `
      + `and arrive at ${chflight.dst} in ${dateformat(chflight.atime, "yyyy-mm-dd h:MM:ss" )} \nFee: ${chflight.fee}`;
            }
        }
        agent.add(msg);

    }
    return getInformation(agent.parameters.ticketId, callback);
}

function getInformation(ticketId, callback) {
    return Ticket.findOne({passcode: ticketId}).then(chTicket => {
        if (chTicket) {
            console.log(chTicket.flightId);
            return Flight.findOne({flightId: chTicket.flightId}).then(obj => {
                callback(chTicket, obj);
            }).catch(err2 => {
                console.log(err2);
            });
        }
        else {
            callback(null, null);
        }
    }).catch(err => {
        console.log(err);
    })
}


function setMappingInfo(intentMap) {
    intentMap.set('Ticket Info - select.number', getFlightInfo);
  }

module.exports = setMappingInfo;