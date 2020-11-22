const dataCommandKeys = require('./data-command-keys');

const getDataResolvers = (key, country) => {
    const {confirmed, deaths, recovered, delta_confirmed, delta_deaths, delta_recovered} = country;

    switch (key) {
        case dataCommandKeys.all:
            return 'Нових випадків: *' + delta_confirmed + '*\n' +
                'Одужали за добу: *' + delta_recovered + '*\n' +
                'Летальних випадків за добу: *' + delta_deaths + '*\n' +
                '___\n' +
                'Всього випадків: *' + confirmed + '*\n' +
                'Всього одужало: *' + recovered + '*\n' +
                'Всього летальних випадків: *' + deaths + '*\n';
        case dataCommandKeys.lastDay:
            return 'Нових випадків: *' + delta_confirmed + '*\n' +
                'Одужали за добу: *' + delta_recovered + '*\n' +
                'Летальних випадків за добу: *' + delta_deaths + '*\n';
        case dataCommandKeys.lastDayConfirmed:
            return 'Нових випадків: *' + delta_confirmed + '*\n';
        case dataCommandKeys.lastDayRecovered:
            return 'Одужали за добу: *' + delta_recovered + '*\n';
        case dataCommandKeys.lastDayDeaths:
            return 'Летальних випадків за добу: *' + delta_deaths + '*\n';
    }
};

module.exports = getDataResolvers;