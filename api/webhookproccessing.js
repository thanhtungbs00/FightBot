const   { WebhookClient } = require('dialogflow-fulfillment');
// const   { Carousel } = require('actions-on-google');
const { Card, Suggestion} = require('dialogflow-fulfillment');
// processing by function
const   {setMappingReser} = require('./makeflight');
const setMappingInfo = require('./flightInfo');
const   {setMappingChange} = require('./change/makechange');



process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function welcome(agent) {
    agent.add(`Hello, welcome to TL travel agency, how may I help you !`);
    agent.add(new Suggestion('I want to book a flight'));
    agent.add(new Suggestion('I want to check ticket information'));

}

function fallback(agent) {
    agent.add(`I didnt understand`);
    agent.add(`I'm sorry, can you try again?`);
}

module.exports = {
    Webhook : (req, res) => {
        const agent = new WebhookClient({request: req, response: res});
        let intentMap = new Map();
        setMappingReser(intentMap);
        setMappingInfo(intentMap);
        
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);

        // change proceesing
        setMappingChange(intentMap);
        
        agent.handleRequest(intentMap);
    }
}


