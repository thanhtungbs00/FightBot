const   { Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');
// const   { BasicCard, Button } = require('actions-on-google');

const   { Flight } = require('../../models/Flight');
const   Ticket = require('../../models/Ticket');

const   { getTime } = require('./test_utils');

// global context 
const makechangeContext = {
    'name':'makechange',
    'lifespan': 5,
    'parameters':{}
}

async function getTicket(agent) {
    let context = agent.context.get('makechange');
    if (context==null || context==undefined){
        agent.add(`Let me know what you want to do!`);
        return ;
    }
    let code = agent.parameters.code;
    if (code==null || code == undefined){
        return makeChange(agent);
    }
    try{
        let ticket = await Ticket.findOne({'passcode': code});
        if (ticket){
            let flight = await Flight.findOne({'flightId': ticket.flightId});

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

async function makeChange (agent){
    agent.add(`Okay, Can you give me some information of your ticket like your ID or passcode flight.`);

    agent.context.set(makechangeContext);
    return ;
}

function cancelFlight (agent){
    // get param, context
    let context = agent.context.get('makechange');
    console.log(context);

    if (context!=null){
        let param = agent.context.get('makechange').parameters;
        if (param == undefined){
            return makeChange(agent);
        }
        agent.context.set({
            'name':'makechange.cancel',
            'lifespan': 1,
            'parameters':{
                code: param.code
            }
        });
        agent.add("Are you sure cancel your ticket ? ~");
        agent.add(new Suggestion('Yes'));
        agent.add(new Suggestion('No'));
        return;
    }
    return makeChange(agent);
}

async function cancelYes(agent) {
    let context = agent.context.get('makechange.cancel');
    if (context == null) {
        agent.add("please try again !");
        return;
    }
    try{
        let code = agent.context.get('makechange.cancel').parameters.code;
        
        // delete ticket in database
        await Ticket.deleteOne({'passcode': code});

        // remove context
        agent.context.delete('makechange');

        agent.add(`We have cancel your ticket`);
    } catch(e) {
        agent.add(`Have some issue, you can try again`);
    }
    
}

function cancelNo(agent) {
    let context = agent.context.get('makechange.cancel');
    if (context == null) {
        agent.add("please try again !");
        return;
    }
    // remove context
    agent.context.delete('makechange');

    agent.add(`Okay, I got it. Do you need more my support~`);
}

function changedate(agent){
    let context = agent.context.get('makechange');
    console.log(context);
    if (context==undefined || context==null) {
        agent.add(`Sorry, I can't know what you want to do! Can you say again clearly ?`);
        return ;
    }
    let param = agent.context.get('makechange').parameters;
    let date, code;
    code = param.code;
    date = param.date;
    if (!date) {
        agent.add('Which day do you want to change ?');
        return ;
    }
    if (!code){
        agent.add('Let me know your passcode ticket!');
        return ;
    }
    
    let day = date.getDate();
    console.log(date.toString());
    console.log(day);
    agent.add(`ngao thao`);
}

function setMappingChange(intentMap) {
    intentMap.set('user.getticket', getTicket);
    intentMap.set('user.makechange', makeChange);
    intentMap.set('user.makechange.cancel', cancelFlight);
    intentMap.set('user.makechange.cancel - yes', cancelYes);
    intentMap.set('user.makechange.cancel - no', cancelNo);
    intentMap.set('user.makechange.date', changedate);
}

module.exports = {
    setMappingChange
}