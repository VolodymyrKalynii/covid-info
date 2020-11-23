const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const makeRequest = require('./request-maker');
//'40 21 * * *' о 21.40
//'* * * * * *' кожну секунду

/**
 *
 * @param {RTMClient} rtm
 */
const initCron = (rtm) => {
    const job = new CronJob('20 8 * * *', async () => {
        console.log('You will see this message every second');

        await makeRequest(rtm);
    }, null, true, 'Europe/Kiev');
    job.start();
};


// globals

const apiLink = 'https://volodymyrkalynii.github.io/covid-info/data.json';
const job = new CronJob('0 */25 * * * *', async () => {
    console.log('You will see this message every second');

    fetch(apiLink)
        .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
        .catch(err => console.log(err));
}, null, true, 'Europe/Kiev');
job.start();

module.exports = initCron;