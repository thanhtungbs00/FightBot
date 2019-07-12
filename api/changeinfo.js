const { Card, Suggestion} = require('dialogflow-fulfillment');

function getTicket(agent) {
    agent.add(`okay, I miss you`);
}

module.exports = {
    getTicket
}
