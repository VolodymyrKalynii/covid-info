const initCron = require('./src/cron-initter');
const init = require('./src/rtm');



//todo відкрефакторити ато пісос
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
// //todo винести makeRequest в окремий файл
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

// initCron(makeRequest);

init();


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
//     // const res = await web.chat.postMessage({ channel: 'bot-test', text: 'Hello there' });
//
//     // const res = await web.chat.postMessageToUser('user_name', 'Hello world!');
//
//     // `res` contains information about the posted message
//     // console.log('Message sent: ', res.ts);
// })();


// http.createServer(async (request, response) =>{
//
//     response.setHeader("Content-Type", "text/html; charset=utf-8;");
//     console.log('adasda');
//     if(request.url === "/home" || request.url === "/"){
//         response.write("<h2>Home</h2>");
//
//         await web.chat.postMessage({ channel: 'bot-test', text: 'home' });
//     }
//     else if(request.url === "/about"){
//         await web.chat.postMessage({ channel: 'bot-test', text: 'about' });
//     }
//     else if(request.url === "/test"){
//         await web.chat.postMessage({ channel: 'bot-test', text: 'test' });
//     }
//     else{
//         response.write("<h2>Not fdound</h2>");
//     }
//     response.end();
// }).listen(3000);

// Listen for users who join a channel that the bot user is a member of
// See: https://api.slack.com/events/member_joined_channel
// rtm.on('member_joined_channel', async (event) => {
//     try {
//         // Send a welcome message to the same channel where the new member just joined, and mention the user.
//         const reply = await rtm.sendMessage(`Welcome to the channel, <@${event.user}>`, event.channel);
//         console.log('Message sent successfully', reply.ts);
//     } catch (error) {
//         console.log('An error occurred', error);
//     }
// });