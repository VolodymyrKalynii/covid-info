const fetch = require('node-fetch');
const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');

// const token = 'xoxb-367332637153-1509969632099-L4r76oVlMVxFRQpw7Y61ytje';
// const token = 'xoxp-367332637153-431652065585-1508034348533-45343e6bc251e118de5953d9aa4b74a0';
const token = 'xoxb-367332637153-1496429841015-cyNZIFMMSCzogXjUPRqZYko1';
const apiLinkPart = 'https://api-covid19.rnbo.gov.ua/data?to=2020-11-18';

const formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};


console.log(formatDate(Date.now()));


const rtm = new RTMClient(token);

rtm.on('message', async (event) => {
    console.log('event', event);
    const {text} = event;
    let resp = '';
    if (text === 'h') {
        resp = 'команди для юзання'
    } else if (text === 'g') {
        const res = await fetch(apiLinkPart);
        const data = await res.text();

        const parsedData = JSON.parse(data);
        const {world} = parsedData;
        const country = world.filter(C => C.country === 'Ukraine')[0];
        // console.log(country);
        // console.log(country.delta_confirmed);

        resp = `delta_confirmed ${country.delta_confirmed}`;
    }
    else {
        resp = `єбой Welcome to the channel, <@${event.user}>`;
    }

    const reply = rtm.sendMessage(resp, event.channel).then(() => {
        console.log('єбой', reply.ts);
    });

});

(async () => {
    // Connect to Slack
    const { self, team } = await rtm.start();
    console.log('self', self);
})();


console.log(Date.now());

// fetch(apiLinkPart)
//     .then(res => res.text())
//     .then(body => {
//         const parsedData = JSON.parse(body);
//
//         const {world} = parsedData;
//         const country = world.filter(C => C.country === 'Ukraine')[0];
//         console.log(country);
//         console.log(country.delta_confirmed);
//         // console.log(world.filter(C => C.country === 'Ukraine')[0]);
//     });



// Listen for users who join a channel that the bot user is a member of
// See: https://api.slack.com/events/member_joined_channel
// rtm.on('member_joined_channel', async (event) => {
//     try {
//         // Send a welcome message to the same channel where the new member just joined, and mention the user.
//         const reply = await rtm.sendMessage(`Welcome to the channel, <@${event.user}>`, event.channel);
//         console.log('Message sent successfully', reply.ts);
//     } catch (error) {
//         console.log('An error occurred', error);
//     }
// });