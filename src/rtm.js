const {RTMClient} = require('@slack/rtm-api');
// const cache = require('memory-cache');
// const makeRequest = require('./request-maker');

const {botToken} = require('./config');

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

        const stringText = text.toString();

        if (!stringText.includes(botName)) return null;


        const resp = 'Всім привіт, я - бот, який виводить дані по статистиці корони в Україні.\n' +
            'На даний момент я вмію виводити:\n' +
            '*Актуальну статистику*;\n' +
            '*Кількість нових випадків за добу*;\n' +
            '*Кількість людей, які одужали за добу*;\n' +
            '*Кількість летальних випадків за добу*;\n' +
            'Також, я буду сам кожного ранку виводити нові дані в чат(якщо сервак не впаде).\n' +
            'Якщо я не відповідаю, тикніть Вову, він мене перезапустить.\n' +
            'Поки все, може потім щось ще навчусь, якщо Вові буде не влом.\n' +
            'Для відображення списку команд введіть: /h\n' +
            'І звісно, не забувайте носити маски, мити руки і пити ромашку обов\'язково.';

        const reply = rtm.sendMessage(resp, event.channel).then(() => {
            console.log('єбой1', reply.ts);
        });

        // const newText = text.replace(botName, '').trim();
        // const command = newText.split("*").join("");
        // if (command === 'h') {
        //     const country = cache.get('parsedBody');
        //
        //     if (!country) {
        //         const reply = rtm.sendMessage('fuuu', event.channel).then(() => {
        //             console.log('єбой1', reply.ts);
        //         });
        //         makeRequest();
        //     } else {
        //         const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;
        //         const resp ='Нових випадків: *' + delta_confirmed + '*\n' +
        //             'Одужали за добу: *' + delta_recovered + '*\n' +
        //             'Летальних випадків за добу: *' + delta_deaths + '*\n' +
        //             '___\n' +
        //             'Всього випадків: *' + confirmed + '*\n' +
        //             'Всього одужало: *' + recovered + '*\n' +
        //             'Всього летальних випадків: *' + deaths + '*\n';
        //
        //         const reply = rtm.sendMessage(resp, event.channel).then(() => {
        //             console.log('єбой1', reply.ts);
        //         });
        //     }
        //
        //
        // } else {
        //     const resp = 'Всім привіт, я - бот, який виводить дані по статистиці корони в Україні.\n' +
        //         'На даний момент я вмію виводити:\n' +
        //         '*Актуальну статистику*;\n' +
        //         '*Кількість нових випадків за добу*;\n' +
        //         '*Кількість людей, які одужали за добу*;\n' +
        //         '*Кількість летальних випадків за добу*;\n' +
        //         'Також, я буду сам кожного ранку виводити нові дані в чат(якщо сервак не впаде).\n' +
        //         'Якщо я не відповідаю, тикніть Вову, він мене перезапустить.\n' +
        //         'Поки все, може потім щось ще навчусь, якщо Вові буде не влом.\n' +
        //         'Для відображення списку команд введіть: /h\n' +
        //         'І звісно, не забувайте носити маски, мити руки і пити ромашку обов\'язково.';
        //
        //     const reply = rtm.sendMessage(resp, event.channel).then(() => {
        //         console.log('єбой1', reply.ts);
        //     });
        // }

    });

    // Listen for users who join a channel that the bot user is a member of
    // See: https://api.slack.com/events/member_joined_channel
    rtm.on('member_joined_channel', async (event) => {
        try {
            // Send a welcome message to the same channel where the new member just joined, and mention the user.
            const reply = await rtm.sendMessage(`Дороу, <@${event.user}>`, event.channel);
            console.log('Message sent successfully', reply.ts);
        } catch (error) {
            console.log('An error occurred', error);
        }
    });

    return rtm;
};

module.exports = init;