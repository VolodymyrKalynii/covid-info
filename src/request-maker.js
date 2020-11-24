const fetch = require('node-fetch');
const cache = require('memory-cache');
const isEqual = require('lodash.isequal');

const currentDate = require('./current-data-getter');
const {cacheDataLifeTime, timeToMakeRequest} = require('./config');
const apiLink = `https://api-covid19.rnbo.gov.ua/data?to=${currentDate}`; // currentDate = yyyy-mm-dd

let interval;

/**
 *
 * @param {Function?} callback
 * @returns {PromiseLike<any> | Promise<any>}
 */
const makeRequest = (callback) => fetch(apiLink)
    .then(res => res.text())
    .then(body => {
        const {country, hasNewData} = checkNewData(body);
        console.log('hasNewData big', hasNewData);
        if (hasNewData) {
            saveNewDataAction(country, callback);
        } else {
            interval = setInterval(() => {
                fetch(apiLink)
                    .then(res => res.text())
                    .then(body => {
                        const {country, hasNewData} = checkNewData(body);

                        if (hasNewData) {
                            saveNewDataAction(country, callback);
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
    const {delta_confirmed, delta_deaths, delta_recovered} = country;

    return { // добавив провірку на 0, бо якогось фіга, зранку апі вертає нульові значення
        hasNewData: delta_confirmed > 0 && delta_deaths > 0 && delta_recovered > 0 && !isEqual(country, oldCachedData),
        country
    };
};

/**
 *
 * @param country
 * @param {Function} callback
 */
const saveNewDataAction = (country, callback) => {
    clearInterval(interval);

    cache.put('parsedBody', country, cacheDataLifeTime);

    if (callback)
        workWithData(country, callback)
};

/**
 *
 * @param country
 * @param {Function} callback
 */
const workWithData = (country, callback) => {
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

    callback(resp);
};

module.exports = makeRequest;