// const http = require('http');
// const {WebClient} = require('@slack/web-api');

const express = require("express");

const initCron = require('./src/cron-initter');
const init = require('./src/rtm');

const rtm = init();

initCron(rtm);

const app = express();

app.get("/", function(request, response){
    console.log('glob');
    response.send("<h1>Главная страница</h1>");
});
app.use("/about", function(request, response){

    console.log('/about');
    let id = request.query.id;
    let userName = request.query.name;
    response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
});
app.use("/lol", function(request, response){

    console.log('/lol');
    let id = request.query.id;
    let userName = request.query.name;
    response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
});

app.listen(process.env.PORT);


// http.createServer(function(request, response){
//
//     response.setHeader("UserId", 12);
//     response.setHeader("Content-Type", "text/html; charset=utf-8;");
//     response.write("<h2>hello world</h2>");
//     response.end();
// }).listen(process.env.PORT);

// const workWithData = (country) => {
//
//     console.log('parsedBody', country);
//     const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;
//     const resp = 'Прийшли нові данні за *' + currentDate + '*\n' +
//         'Нових випадків: *' + delta_confirmed + '*\n' +
//         'Одужали за добу: *' + delta_recovered + '*\n' +
//         'Летальних випадків за добу: *' + delta_deaths + '*\n' +
//         '___\n' +
//         'Всього випадків: *' + confirmed + '*\n' +
//         'Всього одужало: *' + recovered + '*\n' +
//         'Всього летальних випадків: *' + deaths + '*\n';
//
//     const reply = rtm.sendMessage(resp, 'C01FFEG3NBE').then(() => {
//         console.log('єбой', reply.ts);
//     });
// };
//
//
// let interval;
//
//
// const checkNewData = (newData) => {
//     const newParsedData = JSON.parse(newData);
//
//     const {world} = newParsedData;
//     const country = world.find(c => c.country === 'Ukraine');
//     const oldCachedData = cache.get('parsedBody');
//
//     return {
//         hasNewData: !isEqual(country, oldCachedData),
//         newParsedData: country
//     };
// };
//
// const saveNewDataAction = (newParsedData) => {
//     clearInterval(interval);
//
//     cache.put('parsedBody', newParsedData, cacheDataLifeTime);
//     workWithData(newParsedData)
// };
//

// const makeRequest = () => fetch(apiLink)
//     .then(res => res.text())
//     .then(body => {
//         const {newParsedData, hasNewData} = checkNewData(body);
//         console.log('hasNewData big', hasNewData);
//         if (hasNewData) {
//             saveNewDataAction(newParsedData);
//         } else {
//             interval = setInterval(() => {
//                 fetch(apiLink)
//                     .then(res => res.text())
//                     .then(body => {
//                         const {newParsedData, hasNewData} = checkNewData(body);
//
//                         if (hasNewData) {
//                             saveNewDataAction(newParsedData);
//                         }
//                     });
//             }, timeToMakeRequest);
//         }
//     });




// let country;
//
// fetch(apiLink)
//     .then(res => res.text())
//     .then(body => {
//         console.log(Date.now());
//         const parsedData = JSON.parse(body);
//         console.log(Date.now());
//         const {world} = parsedData;
//         country = world.find(c => c.country === 'Ukraine');
//     });



// rtm.on('message', async (event) => {
//     console.log('event', event);
//     const {text} = event;
//     let resp = '';
//     const stringText = text.toString();
//
//     if (!stringText.includes(botName)) return null;
//
//     const newText = text.replace(botName, '').trim();
//
//     console.log('newText', newText);
//
//     if (newText === 'h') {
//         const {all, lastDayConfirmed, lastDayRecovered, lastDay, lastDayDeaths} = dataCommandKeys;
//         resp = 'Список команд:\n' +
//             '*' + all + '* - Отримати всю актуальну статистику;\n' +
//             '*' + lastDayConfirmed + '* - Вивести кількість нових випадків(за останню добу);\n' +
//             '*' + lastDayRecovered + '* - Вивести скільки одужало(за останню добу);\n' +
//             '*' + lastDayDeaths + '* - Вивести летальних випадків(за останню добу);\n' +
//             '*' + lastDay + '* - Вивести всі нові дані(за останню добу);\n' +
//             '*h* - Вивести список всіх команд;\n';
//     } else if (!newText) {
//         resp = 'Всім привіт, я - бот, який виводить дані по статистиці корони в Україні.\n' +
//             'На даний момент я вмію виводити:\n' +
//             '*Актуальну статистику*;\n' +
//             '*Кількість нових випадків за добу*;\n' +
//             '*Кількість людей, які одужали за добу*;\n' +
//             '*Кількість летальних випадків за добу*;\n' +
//             'Також, я буду сам кожного ранку виводити нові дані в чат.\n' +
//             'Поки все, може потім щось ще навчусь, якщо Вові буде не влом.\n' +
//             'Для відображення списку команд введіть: ' + `${botName} h\n` +
//             'І звісно, не забувайте носити макси, мити руки і пити ромашку обов\'язково.';
//     } else if (dataCommandKeys[newText]) {
//         resp = checkHasData(newText)
//     } else {
//         resp = 'Не знаю такої команди ¯\\_(ツ)_/¯. \n' +
//             'Для відображення списку команд введіть: ' + `${botName} h`;
//     }
//
//     const reply = rtm.sendMessage(resp, event.channel).then(() => {
//         console.log('єбой1', reply.ts);
//     });
// });


// const getDataResolvers = (key, country) => {
//     const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;
//
//     switch (key) {
//         case dataCommandKeys.all:
//             return 'Нових випадків: *' + delta_confirmed + '*\n' +
//                 'Одужали за добу: *' + delta_recovered + '*\n' +
//                 'Летальних випадків за добу: *' + delta_deaths + '*\n' +
//                 '___\n' +
//                 'Всього випадків: *' + confirmed + '*\n' +
//                 'Всього одужало: *' + recovered + '*\n' +
//                 'Всього летальних випадків: *' + deaths + '*\n';
//         case dataCommandKeys.lastDay:
//             return 'Нових випадків: *' + delta_confirmed + '*\n' +
//                 'Одужали за добу: *' + delta_recovered + '*\n' +
//                 'Летальних випадків за добу: *' + delta_deaths + '*\n';
//         case dataCommandKeys.lastDayConfirmed:
//             return 'Нових випадків: *' + delta_confirmed + '*\n';
//         case dataCommandKeys.lastDayRecovered:
//             return 'Одужали за добу: *' + delta_recovered + '*\n';
//         case dataCommandKeys.lastDayDeaths:
//             return 'Летальних випадків за добу: *' + delta_deaths + '*\n';
//     }
// };

// (async () => {
//     // Connect to Slack
//     const {self} = await rtm.start();
//     console.log('self', self);
//     const {id} = self;
//
//     botName = `<@${id}>`;
// })();


// const token = 'xoxb-367332637153-1523787220897-ikGh6x8hTRpoQrxdVIgCbiin';
// const web = new WebClient(token);
//
// (async () => {
//     // See: https://api.slack.com/methods/chat.postMessage
//     const res = await web.chat.postMessage({ channel: 'DCQ0M1HNYe', text: 'Hello there' });
//
//     // const res = await web.chat.postMessage('DCQ0M1HNYe', 'Hello world!');
//
//     // `res` contains information about the posted message
//     // console.log('Message sent: ', res.ts);
// })();


