const   { Card, Suggestion, Button } = require('dialogflow-fulfillment');
const   Flight = require('../model/filght');
const   Ticket = require('../model/ticket');

//TODO: Test code and test various api in gg

function getTicket(agent) {
    let ticket;
    try {
        ticket = new Ticket({
            username: "Cao Thanh Tung",
            email: "cs.tungthanh@gmail.com",
            day: "10-7-2018",
            description: "Come back home with girlfriend",
            passcode: "VJ5498"
        });
        console.log(ticket);
        
        // save down database
        Ticket.create(ticket);
        
    } catch (e){
        console.log(e);
        return;
    }
    agent.add(`okay, I miss you`);
}

function changeFlight (agent){
    agent.add(`Okay, Can you give me some information of your ticket like your ID or passcode of ticket.`);
}

module.exports = {
    getTicket,
    changeFlight
}

const   imageUrl = 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png';
const   imageUrl2 = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const   linkUrl = 'https://assistant.google.com/';
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


