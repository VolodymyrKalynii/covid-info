const express = require("express");
const cache = require('memory-cache');
const makeRequest = require('./request-maker');
const dataCommandKeys = require('./data-command-keys');
const getAllDataJsonSection = require('./all-data-json-section-getter');

const initServer = () => {
    const app = express();

    app.get("/", (request, response) =>{
        console.log('glob');
        response.send("<h1>Main page</h1>");
    });
    app.use("/h", (request, response) => {
        const {all, lastDayConfirmed, lastDayRecovered, lastDay, lastDayDeaths} = dataCommandKeys;
        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Список команд:"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": '*' + all + '* - Отримати всю актуальну статистику;\n' +
                            '*' + lastDayConfirmed + '* - Вивести кількість нових випадків(за останню добу);\n' +
                            '*' + lastDayRecovered + '* - Вивести скільки одужало(за останню добу);\n' +
                            '*' + lastDayDeaths + '* - Вивести летальних випадків(за останню добу);\n' +
                            '*' + lastDay + '* - Вивести всі нові дані(за останню добу);\n' +
                            '*h* - Вивести список всіх команд;'
                    }
                },
            ]
        };

        response.send(json);
    });
    app.use("/reset", async (request, response) => {

        const callback = (resp) => {
            response.send(resp);
        };

        await makeRequest(callback, true);
        //
        // if (!country) {
        //     sendAltMessage(response);
        //     return null;
        // }
        //
        // const json = getAllDataJsonSection(country);
        //
        // response.send(json);
    });
    app.use("/all", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const json = getAllDataJsonSection(country);

        response.send(json);
    });
    app.use("/loadFromApi", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const json = getAllDataJsonSection(country);

        response.send(json);
    });
    app.use("/ld", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const {delta_confirmed, delta_deaths, delta_recovered} = country;

        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Нових випадків: *' + delta_confirmed + '*\n' +
                            'Одужали за добу: *' + delta_recovered + '*\n' +
                            'Летальних випадків за добу: *' + delta_deaths + '*'
                    }
                },
            ]
        };

        response.send(json);
    });
    app.use("/ld-confirmed", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const {delta_confirmed} = country;

        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Нових випадків: *' + delta_confirmed + '*'
                    }
                },
            ]
        };

        response.send(json);
    });
    app.use("/ld-recovered", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const {delta_recovered} = country;

        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Одужали за добу: *' + delta_recovered + '*'
                    }
                },
            ]
        };

        response.send(json);
    });
    app.use("/ld-deaths", (request, response) => {
        const country = cache.get('parsedBody');

        if (!country) {
            sendAltMessage(response);
            return null;
        }

        const {delta_deaths} = country;

        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Летальних випадків за добу: *' + delta_deaths + '*'
                    }
                },
            ]
        };

        response.send(json);
    });

    // app.listen(3000);
    app.listen(process.env.PORT);
};


const sendAltMessage = (response) => {
    response.send('Упс, щось не так з даними(');
    makeRequest();
};

module.exports = initServer;