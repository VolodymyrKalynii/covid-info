const {RTMClient} = require('@slack/rtm-api');
const cache = require('memory-cache');

const {botToken} = require('./config');
const getDataResolvers = require('./data-resolvers');
const makeRequest = require('./request-maker');
const dataCommandKeys = require('./data-command-keys');

/**
 *
 * @returns {RTMClient}
 */
const init = () => {
    const rtm = new RTMClient(botToken);
    let botName;

    (async () => {
        const {self} = await rtm.start();
        console.log('self', self);
        const {id} = self;

        botName = `<@${id}>`;
    })();

    rtm.on('message', async (event) => {
        console.log('event', event);
        const {text} = event;
        let resp = '';
        const stringText = text.toString();

        if (!stringText.includes(botName)) return null;

        const newText = text.replace(botName, '').trim();
        const command = newText.split("*").join("");

        if (command === 'h') {
            const {all, lastDayConfirmed, lastDayRecovered, lastDay, lastDayDeaths} = dataCommandKeys;
            resp = 'Список команд:\n' +
                '*' + all + '* - Отримати всю актуальну статистику;\n' +
                '*' + lastDayConfirmed + '* - Вивести кількість нових випадків(за останню добу);\n' +
                '*' + lastDayRecovered + '* - Вивести скільки одужало(за останню добу);\n' +
                '*' + lastDayDeaths + '* - Вивести летальних випадків(за останню добу);\n' +
                '*' + lastDay + '* - Вивести всі нові дані(за останню добу);\n' +
                '*h* - Вивести список всіх команд;\n';
        } else if (!command) {
            resp = 'Всім привіт, я - бот, який виводить дані по статистиці корони в Україні.\n' +
                'На даний момент я вмію виводити:\n' +
                '*Актуальну статистику*;\n' +
                '*Кількість нових випадків за добу*;\n' +
                '*Кількість людей, які одужали за добу*;\n' +
                '*Кількість летальних випадків за добу*;\n' +
                'Також, я буду сам кожного ранку виводити нові дані в чат.\n' +
                'Поки все, може потім щось ще навчусь, якщо Вові буде не влом.\n' +
                'Для відображення списку команд введіть: ' + `${botName} h\n` +
                'І звісно, не забувайте носити макси, мити руки і пити ромашку обов\'язково.';
        } else if (dataCommandKeys[command]) {
            resp = checkHasData(command, rtm)
        } else {
            resp = 'Не знаю такої команди ¯\\_(ツ)_/¯. \n' +
                'Для відображення списку команд введіть: ' + `${botName} h`;
        }

        const reply = rtm.sendMessage(resp, event.channel).then(() => {
            console.log('єбой1', reply.ts);
        });
    });

    return rtm;
};

/**
 *
 * @param key
 * @param {RTMClient} rtm
 * @returns {string}
 */
const checkHasData = (key, rtm) => {
    const country = cache.get('parsedBody');

    if (!country) {
        makeRequest(rtm).then(r => console.log(r));

        return 'Упс, щось не так з даними, пробую дістати ще раз...';
    } else {
        return getDataResolvers(key, country)
    }
};

module.exports = init;