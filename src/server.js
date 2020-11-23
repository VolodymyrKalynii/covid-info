const express = require("express");
const cache = require('memory-cache');

const dataCommandKeys = require('./data-command-keys');

const initServer = () => {
    const app = express();

    app.get("/", function(request, response){
        console.log('glob');
        response.send("<h1>Main page</h1>");
    });
    app.use("/about", function(request, response){
        const json = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*It's 80 degrees right now.*"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Partly cloudy today and tomorrow"
                    }
                }
            ]
        };
        console.log('/about');

        response.send(json);
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
                            '*h* - Вивести список всіх команд;\n'
                    }
                },
            ]
        };
        console.log('help');
        response.send(json);
    });
    app.use("/all", (request, response) => {
        const country = checkHasData(response);
        // const country = cache.get('parsedBody');

        if (!country) return null;

        const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;
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
                        "text": 'Нових випадків: *' + delta_confirmed + '*\n' +
                            'Одужали за добу: *' + delta_recovered + '*\n' +
                            'Летальних випадків за добу: *' + delta_deaths + '*\n' +
                            '___\n' +
                            'Всього випадків: *' + confirmed + '*\n' +
                            'Всього одужало: *' + recovered + '*\n' +
                            'Всього летальних випадків: *' + deaths + '*\n'
                    }
                },
            ]
        };
        console.log('help');
        response.send(json);
    });
    app.use("/lol", function(request, response){

        console.log('/lol');
        let id = request.query.id;
        let userName = request.query.name;
        response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
    });

    app.listen(3000);
    // app.listen(process.env.PORT);
};

/**
 *
 * @param response
 * @returns {null}
 */
const checkHasData = (response) => {
    const country = cache.get('parsedBody');
        //todo викликати тут makeRequest
    if (!country) {
        response.send('Упс, щось не так з даними, пробую дістати ще раз...');
    }

    return country;
};

module.exports = initServer;