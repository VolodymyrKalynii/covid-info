const CronJob = require('cron').CronJob;

//'40 21 * * *' о 21.40
//'* * * * * *' кожну секунду

/**
 *
 * @param {Function} callback
 */
const initCron = (callback) => {
    const job = new CronJob('40 21 * * *', async () => {
        console.log('You will see this message every second');

        if (callback)
            await callback();
    }, null, true, 'Europe/Kiev');
    job.start();
};

module.exports = initCron;