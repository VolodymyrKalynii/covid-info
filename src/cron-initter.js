const CronJob = require('cron').CronJob;

const makeRequest = require('./request-maker');
//'40 21 * * *' о 21.40
//'* * * * * *' кожну секунду

/**
 *
 * @param {RTMClient} rtm
 */
const initCron = (rtm) => {
    const job = new CronJob('43 18 * * *', async () => {
        console.log('You will see this message every second');

        await makeRequest(rtm);
    }, null, true, 'Europe/Kiev');
    job.start();
};

module.exports = initCron;