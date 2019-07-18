// const   { Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');
// const   { BasicCard, Button } = require('actions-on-google');

const   { Flight } = require('../models/Flight');
const   Ticket = require('../models/Ticket');

async function getTicket(agent) {
    let passcode = agent.parameters.any;
    try{
        let ticket = await Ticket.findOne({'passcode': passcode});
        let flight = await Flight.findOne({'flightId': passcode});
        if (ticket && flight){
            agent.add(`okay, your ticket is ${passcode}`);
            agent.add(`Your flight depart at ${flight.src} to ${flight.des}`)
        }
        else {
            agent.add("I don't find your passcode in transaction history. Can you give me again");
        }
    } catch (e) {
        console.log(e);
        return;
    }
}

function makeChange (agent){
    agent.add(`Okay, Can you give me some information of your ticket like your ID or passcode flight.`);
    
    agent.setContext({
        'name':'makechange',
        'lifespan': 5,
        'parameters':{}
      });
}

function setMappingChange(intentMap) {
    intentMap.set('user.getticket', getTicket);
    intentMap.set('user.makechange', makeChange);
}

module.exports = {
    setMappingChange
}
















// function other(agent) {
//     agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
//     agent.add(new Card({
//         title: `Title: this is a card title`,
//         imageUrl: imageUrl,
//         text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
//         buttonText: 'This is a button',
//         buttonUrl: linkUrl
//       })
//     );
//     agent.add(new Suggestion(`Quick Reply`));
//     agent.add(new Suggestion(`Suggestion`));
//     agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
//   }

// function flight(agent) {
//     const city = agent.parameters['geo-city'];
//     const time = agent.parameters['time'];
//     const gotCity = city.length > 0;
//     const gotTime = time.length > 0;

//     if(gotCity && gotTime) {
//         agent.add(`Nice, you want to fly to ${city} at ${time}.`);
//     } else if (gotCity && !gotTime) {
//         agent.add('Let me know which time you want to fly');
//     } else if (gotTime && !gotCity) {
//         agent.add('Let me know which city you want to fly to');
//     } else {
//         agent.add('Let me know which city and time you want to fly');
//     }
// }


// let ticket;
//     try {
//         ticket = new Ticket({
//             username: "Cao Thanh Tung",
//             email: "cs.tungthanh@gmail.com",
//             day: "10-7-2018",
//             description: "Come back home with girlfriend",
//             passcode: "VJ5498"
//         });
//         console.log(ticket);
        
//         // save down database
//         //Ticket.create(ticket);

//     } catch (e){
//         //console.log(e);
//         alert(`Cannot connect with database`);
//         return;
//     }