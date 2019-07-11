const { WebhookClient } = require('dialogflow-fulfillment');
//const { Carousel } = require('actions-on-google');

// processing by function
const {makeReservation} = require('./makeflight');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function welcome(agent) {
    agent.add(`Welcome to my agent!`);
}

function fallback(agent) {
    agent.add(`I didnt understand`);
    agent.add(`I'm sorry, can you try again?`);
}

module.exports = {
    Webhook : (req, res) => {
        const agent = new WebhookClient({request: req, response: res});
        let intentMap = new Map();
        
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        
        intentMap.set('', makeReservation);

        agent.handleRequest(intentMap);
    }
}


