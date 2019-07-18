const   { Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');
// const   { BasicCard, Button } = require('actions-on-google');

const   { Flight } = require('../../models/Flight');
const   Ticket = require('../../models/Ticket');

const   { getTime } = require('./test_utils');

async function getTicket(agent) {
    let context = agent.getContext('makechange');
    if (context==null){
        agent.setContext({
            'name':'makechange',
            'lifespan': 5,
            'parameters':{}
        });
    }
    let code = agent.parameters.any;
    try{
        let ticket = await Ticket.findOne({'passcode': code});
        if (ticket){
            let flight = await Flight.findOne({'flightId': ticket.flightId});
            // console.log(flight);
            agent.add(`okay, your ticket is ${ticket.flightId}`);
            agent.add(`Your flight departs at ${flight.src} to ${flight.dst}`)
            agent.add(`Your filght departs ` + getTime(flight.dtime));
            
            agent.add(new Suggestion('Change date'));
            agent.add(new Suggestion('Cancel my flight !'));
            agent.add(new Suggestion('Change my flight in same day'));
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

function cancelFlight (agent){
    // get param, context
    let context = agent.getContext('makechange');
    console.log(context);

    if (context!=null){
        let param = agent.getContext('makechange').parameters;
        if (param == undefined){
            return makeChange(agent);
        }
        agent.setContext({
            'name':'makechange.cancel',
            'lifespan': 1,
            'parameters':{
                code: param.any
            }
        });
        agent.add("Are you sure cancel your ticket ? ~");
        return;
    }
    return makeChange(agent);
}

async function cancelYes(agent) {
    let context = agent.getContext('makechange.cancel');
    if (context == null) {
        agent.add("please try again !");
        return;
    }
    try{
        let code = agent.getContext('makechange.cancel').parameters.code;
        
        // delete ticket in database
        await Ticket.deleteOne({'passcode': code});

        // remove context
        agent.setContext({
            'name':'makechange',
            'lifespan': -1,
            'parameters':{}
        });
        agent.add(`We have cancel your ticket`);
    } catch(e) {
        agent.add(`Have some issue, you can try again`);
    }
    
}

function cancelNo(agent) {
    let context = agent.getContext('makechange.cancel');
    if (context == null) {
        agent.add("please try again !");
        return;
    }
    // remove context
    agent.setContext({
        'name':'makechange',
        'lifespan': -1,
        'parameters':{}
    });
    agent.add(`Okay, I got it. Do you need more my support~`);
}

function setMappingChange(intentMap) {
    intentMap.set('user.getticket', getTicket);
    intentMap.set('user.makechange', makeChange);
    intentMap.set('user.makechange.cancel', cancelFlight);
    intentMap.set('user.makechange.cancel - yes', cancelYes);
    intentMap.set('user.makechange.cancel - no', cancelNo);
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