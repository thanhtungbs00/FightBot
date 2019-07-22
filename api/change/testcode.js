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
//             email: "cs.tungthanh@gmail.com",
//             day: Date.now(),
//             description: "Come back home with girlfriend",
//             flightId: "VN8261"
//         });
//         console.log(ticket);
        
//         // save down database
//         Ticket.create(ticket);

//     } catch (e){
//         alert(`Cannot connect with database`);
//         return;
//     }