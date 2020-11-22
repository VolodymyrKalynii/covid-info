const oneDayMs = 86400000; //number of milliseconds in a day
const cacheDataLifeTime = oneDayMs * 2;
const timeToMakeRequest = 1000 * 60 * 5;
const botToken = Buffer.from('eG94Yi0zNjczMzI2MzcxNTMtMTQ5NjQyOTg0MTAxNS13b3lzeE96R05GVVJERm5rY3Z1emZiWmw=', 'base64').toString();

module.exports = {
    cacheDataLifeTime,
    timeToMakeRequest,
    botToken
};