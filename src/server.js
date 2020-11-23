const express = require("express");

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
                // {
                //     "type": "section",
                //     "text": {
                //         "type": "mrkdwn",
                //         "text": `*${lastDayConfirmed}* - Вивести кількість нових випадків(за останню добу);`
                //     }
                // },
                // {
                //     "type": "section",
                //     "text": {
                //         "type": "mrkdwn",
                //         "text": `*${lastDayRecovered}* - Вивести скільки одужало(за останню добу);`
                //     }
                // },
                // {
                //     "type": "section",
                //     "text": {
                //         "type": "mrkdwn",
                //         "text": `*${lastDayDeaths}* - Вивести летальних випадків(за останню добу);`
                //     }
                // },
                // {
                //     "type": "section",
                //     "text": {
                //         "type": "mrkdwn",
                //         "text": `*${lastDay}* - Вивести всі нові дані(за останню добу);`
                //     }
                // },
                // {
                //     "type": "mrkdwn",
                //     "text": `*h* - Вивести список всіх команд;`
                // }
            ]
        };
        console.log('help');
        response.send(json);


        // const resp = 'Список команд:\n' +
        //     '*' + all + '* - Отримати всю актуальну статистику;\n' +
        //     '*' + lastDayConfirmed + '* - Вивести кількість нових випадків(за останню добу);\n' +
        //     '*' + lastDayRecovered + '* - Вивести скільки одужало(за останню добу);\n' +
        //     '*' + lastDayDeaths + '* - Вивести летальних випадків(за останню добу);\n' +
        //     '*' + lastDay + '* - Вивести всі нові дані(за останню добу);\n' +
        //     '*h* - Вивести список всіх команд;\n';
        //
        // response.send(json);
    });
    app.use("/lol", function(request, response){

        console.log('/lol');
        let id = request.query.id;
        let userName = request.query.name;
        response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
    });

    app.listen(process.env.PORT);
};

module.exports = initServer;