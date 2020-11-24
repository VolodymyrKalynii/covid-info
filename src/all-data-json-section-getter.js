/**
 *
 * @param country
 * @returns {{blocks: [{text: {text: string, type: string}, type: string}], response_type: string}}
 */
const getAllDataJsonSection = (country) => {
    const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;

    return  {
        "response_type": "in_channel",
        "blocks": [
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
                        'Всього летальних випадків: *' + deaths + '*'
                }
            },
        ]
    };
};

module.exports = getAllDataJsonSection;