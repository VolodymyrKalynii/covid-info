const fetch = require('node-fetch');
const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');
const CronJob = require('cron').CronJob;
const cache = require('memory-cache');

const oneDayMs = 86400000 //number of milliseconds in a day

const workWithData = (parsedBody) => {

    console.log('parsedBody', parsedBody);
};



const job = new CronJob('*/10 * * * * *', function() {
    console.log('You will see this message every second');

    fetch('https://volodymyrkalynii.github.io/covid-info/data.json')
        .then(res => res.text())
        .then(body => {
            const trimmedBody = body.trim();

            const oldCachedResp = cache.get('oldCachedResp');
            // console.log('oldCachedResp', oldCachedResp);
            // console.log('trimmedBody', trimmedBody);

            let finalData;

            console.log('oldCachedResp !== trimmedBody', oldCachedResp !== trimmedBody);
            if (oldCachedResp !== trimmedBody) {
                console.log('setDataToCache');
                finalData = trimmedBody;
                cache.put('oldCachedResp', trimmedBody, 1000000, function(key, value) {
                    // console.log(key + ' did ' + value);
                }); // Time in ms

                const parsedBody = JSON.parse(trimmedBody);

                cache.put('parsedBody', parsedBody, 1000000, function(key, value) {
                    console.log(key + ' did ' + value);

                }); // Time in ms
                workWithData(parsedBody)

                //тут продовжити роботу з trimmedBody
            } else {
                //якщо я буду робити цей запит раз в сутки, то мені тут треба добавити провірку, що якщо дані однакові,
                // то знову робити запит, поки дані не будуть нові
                //тут можна дістати розпарсене значення
                console.log('workWith parsedData from cache');
                const parsedBody = cache.get('parsedBody');
                workWithData(parsedBody)
            }
        });
}, null, true, 'Europe/Kiev');
job.start();




// cache.put('oldCachedResp', {data:'test'}, 100, function(key, value) {
//     console.log(key + ' did ' + value);
// }); // Time in ms

// console.log('Houdini will now ' + cache.get('houdini'));

// const oldCachedResp = cache.get('oldCachedResp');
// console.log('oldCachedResp', oldCachedResp);


const token = 'xoxb-367332637153-1496429841015-6xEhCI5R0dmRRaXcb2T3inqv';



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

const currentDate = formatDate(Date.now());

const apiLinkPart = `https://api-covid19.rnbo.gov.ua/data?to=${currentDate}`; // currentDate = yyyy-mm-dd

const today = new Date()
const prevDayDate = new Date(today - oneDayMs)

const oldTate = formatDate(prevDayDate);







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