const fetch = require('node-fetch');
const cache = require('memory-cache');
const isEqual = require('lodash.isequal');

const currentDate = require('./current-data-getter');
const {cacheDataLifeTime, timeToMakeRequest} = require('./config');
// const apiLink = 'https://volodymyrkalynii.github.io/covid-info/data.json';
const apiLink = `https://api-covid19.rnbo.gov.ua/data?to=${currentDate}`; // currentDate = yyyy-mm-dd

let interval;

/**
 *
 * @param country
 * @param {RTMClient} rtm
 */
const workWithData = (country, rtm) => {
    console.log('parsedBody', country);

    const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;
    const resp = 'Прийшли нові данні за *' + currentDate + '*\n' +
        'Нових випадків: *' + delta_confirmed + '*\n' +
        'Одужали за добу: *' + delta_recovered + '*\n' +
        'Летальних випадків за добу: *' + delta_deaths + '*\n' +
        '___\n' +
        'Всього випадків: *' + confirmed + '*\n' +
        'Всього одужало: *' + recovered + '*\n' +
        'Всього летальних випадків: *' + deaths + '*\n';

    const reply = rtm.sendMessage(resp, 'C01FFEG3NBE').then(() => {
        console.log('єбой', reply.ts);
    });
};

/**
 *
 * @param newParsedData
 * @param {RTMClient} rtm
 */
const saveNewDataAction = (newParsedData, rtm) => {
    clearInterval(interval);

    cache.put('parsedBody', newParsedData, cacheDataLifeTime);
    workWithData(newParsedData, rtm)
};

/**
 *
 * @param {RTMClient} rtm
 * @returns {PromiseLike<any> | Promise<any>}
 */
const makeRequest = (rtm) => fetch(apiLink)
    .then(res => res.text())
    .then(body => {
        const {newParsedData, hasNewData} = checkNewData(body);
        console.log('hasNewData big', hasNewData);
        if (hasNewData) {
            saveNewDataAction(newParsedData, rtm);
        } else {
            interval = setInterval(() => {
                fetch(apiLink)
                    .then(res => res.text())
                    .then(body => {
                        const {newParsedData, hasNewData} = checkNewData(body);

                        if (hasNewData) {
                            saveNewDataAction(newParsedData, rtm);
                        }
                    });
            }, timeToMakeRequest);
        }
    });


const checkNewData = (newData) => {
    const newParsedData = JSON.parse(newData);

    const {world} = newParsedData;
    const country = world.find(c => c.country === 'Ukraine');
    const oldCachedData = cache.get('parsedBody');

    return {
        hasNewData: !isEqual(country, oldCachedData),
        newParsedData: country
    };
};

module.exports = makeRequest;