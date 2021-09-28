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
 * @param {boolean?} force
 * @returns {PromiseLike<any> | Promise<any>}
 */
const makeRequest = (callback, force) => fetch(apiLink)
    .then(res => res.text())
    .then(body => {
        const {country, hasNewData} = checkNewData(body, force);
        console.log('hasNewData big', hasNewData);
        if (hasNewData) {
            saveNewDataAction(country, callback, force);

        } else {
            interval = setInterval(() => {
                fetch(apiLink)
                    .then(res => res.text())
                    .then(body => {
                        const {country, hasNewData} = checkNewData(body);
                        console.log('hasNewData small', hasNewData);
                        if (hasNewData) {
                            saveNewDataAction(country, callback, force);
                        }
                    });
            }, timeToMakeRequest);
        }
    });


const checkNewData = (newData, force = false) => {
    const newParsedData = JSON.parse(newData);

    const {world} = newParsedData;
    const country = world.find(c => c.country === 'Ukraine');
    const {delta_confirmed, delta_deaths, delta_recovered} = country;

    if (force) {
        return { // добавив провірку на 0, бо якогось фіга, зранку апі вертає нульові значення
            hasNewData: delta_confirmed > 0 && delta_deaths > 0 && delta_recovered > 0,
            country
        };
    }


    const oldCachedData = cache.get('parsedBody');

    return { // добавив провірку на 0, бо якогось фіга, зранку апі вертає нульові значення
        hasNewData: delta_confirmed > 0 && delta_deaths > 0 && delta_recovered > 0 && !isEqual(country, oldCachedData),
        country
    };
};

/**
 *
 * @param country
 * @param {Function} callback
 * @param {boolean} force
 */
const saveNewDataAction = (country, callback, force = false) => {
    clearInterval(interval);

    cache.put('parsedBody', country, cacheDataLifeTime);

    if (callback)
        workWithData(country, callback, force)
};

/**
 *
 * @param country
 * @param {Function} callback
 * @param {boolean} force
 */
const workWithData = (country, callback, force) => {
    console.log('parsedBody', country);

    const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;


    const resp = !force
        ? 'Прийшли нові данні за *' + currentDate + '*\n' +
            'Нових випадків: *' + delta_confirmed + '*\n' +
            'Одужали за добу: *' + delta_recovered + '*\n' +
            'Летальних випадків за добу: *' + delta_deaths + '*\n' +
            '___\n' +
            'Всього випадків: *' + confirmed + '*\n' +
            'Всього одужало: *' + recovered + '*\n' +
            'Всього летальних випадків: *' + deaths + '*\n' + ''
            // '<@UATK7HW12>' + '<@UAW8J3TQW>'
        : 'Прийшли нові данні за *' + currentDate + '*\n' +
            'Нових випадків: *' + delta_confirmed + '*\n' +
            'Одужали за добу: *' + delta_recovered + '*\n' +
            'Летальних випадків за добу: *' + delta_deaths + '*\n' +
            '___\n' +
            'Всього випадків: *' + confirmed + '*\n' +
            'Всього одужало: *' + recovered + '*\n' +
            'Всього летальних випадків: *' + deaths + '*\n';
    // '';

    callback(resp);
};

module.exports = makeRequest;