const   { Card, Suggestion } = require('dialogflow-fulfillment');

const   { Flight } = require('../../models/Flight');
const   Ticket = require('../../models/Ticket');

const   { getTime } = require('./test_utils');
const   { findFlight } = require('../makeflight');

const dateformat = require('dateformat');
const timeFormat = "dd-mm-yyy h:MM:ss";

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
            
            // set information context 
            agent.context.set({
                'name':'makechange',
                'lifespan': context.lifespan-1,
                'parameters':{
                    code: code,
                    oldflightId: ticket.flightId,
                    src: flight.src,
                    dst: flight.dst,
                    dtime: flight.dtime
                }
            });

            agent.add(new Suggestion('Change date'));
            agent.add(new Suggestion('Cancel my flight !'));
            agent.add(new Suggestion(`Change my flight source or destination 's flight`));
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
    // console.log(context);

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
    if (context==undefined || context==null) {
        agent.add(`Sorry, I can't know what you want to do! Can you say again clearly ?`);
        return ;
    }
    
    // paste parameters
    let param = agent.context.get('makechange').parameters;
    let code = param.code;
    let src = param.src;
    let dst = param.dst;
    let date = param.date;
    
    if (!date) {
        agent.add('Which day do you want to change ?');
        return ;
    }
    if (!code){
        agent.add('Let me know your passcode ticket!');
        return ;
    }
    // def callback to use search filght
    var callback = (flights) => {
        for (var i = 0 ; i < flights.length; ++i) {
            var f = flights[i];
            var dtime = dateformat(f.dtime, timeFormat);
            var atime = dateformat(f.atime, timeFormat);
            if (i == 0) {
                agent.add('Here are some flight for you!');
            }
          
            agent.add(new Card({
                title: `Flight ${f.flightId}`,
                imageUrl: 'https://ichef.bbci.co.uk/news/912/cpsprodpb/11BF/production/_107934540_gettyimages-155439315.jpg',
                text: `${f.src} (${dtime}) -> ${f.dst} (${atime})`,
                buttonText: `${f.flightId}`,
                buttonUrl: 'https://assistant.google.com/'
            }));
        }
    }
    // increasing lifespan of context
    agent.context.set({
        'name':'makechange',
        'lifespan': 3
    });

    return findFlight(src, dst, date, callback);
}

async function selectFlight(agent) {
    var context = agent.context.get('makechange');
    var flightID = context.parameters.flightID;
    var code = context.parameters.code;

    try{
        if (flightID.length > 10){
            agent.add(`Something wrong`);
            return;
        }
        await Ticket.findOneAndUpdate(
            {passcode: code}, 
            {flightId: flightID}, 
            );
        
        let ticket = await Ticket.findOne({'passcode': code});
        let flight = await Flight.findOne({'flightId': ticket.flightId});

        agent.add(`okay, your ticket is ${ticket.flightId}`);
        agent.add(`Your flight departs at ${flight.src} to ${flight.dst}`)
        agent.add(`Your filght departs ` + getTime(flight.dtime));
        
    } catch(e) {
        console.log(e);
        return ;
    }
    agent.add(`Okay, I have changed your ticket and your passcode is ${code}`);
}

function makeplace(agent) {
    var context = agent.context.get('makechange');
    
    // paste parameters
    let param = agent.context.get('makechange').parameters;
    let code = param.code;
    let src = param.src;
    let dst = param.dst;
    let date = param.date;

    let nsrc = agent.parameters.nsrc;
    let ndes = agent.parameters.ndes;

    console.log(nsrc);
}

function setMappingChange(intentMap) {
    intentMap.set('user.getticket', getTicket);
    intentMap.set('user.makechange', makeChange);
    intentMap.set('user.makechange.cancel', cancelFlight);
    intentMap.set('user.makechange.cancel - yes', cancelYes);
    intentMap.set('user.makechange.cancel - no', cancelNo);
    intentMap.set('user.makechange.date', changedate);
    intentMap.set('user.makechange.date - select', selectFlight);
    intentMap.set('user.makechange - place', makeplace);
}

module.exports = {
    setMappingChange
}