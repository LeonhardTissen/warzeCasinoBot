const settings = require('../settings.json');
const { db } = require('./db');

function checkIfTimerReady(client, table, time, rewardName) {
    db.all(`SELECT * FROM ${table}`, [], (err, results) => {
        if (err) {
            console.log(err.message);
            return;
        }

        results.forEach((user) => {
            const seconds_left = user.last + time - Date.now() / 1000

            if (seconds_left < 0 && seconds_left > -60) {

                // Look if the user wants to get notified
                db.get('SELECT notify FROM rewardnotify WHERE id = ?', [user.id], (err, row) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    // User has never touched that setting before
                    if (!row) {
                        return;
                    }
                    
                    // If they want to be notified
                    if (row.notify == 1) {
                        // Ping them!
                        const channel = client.channels.cache.get(settings.channel)
                        channel.send(`<@${user.id}>, your ${rewardName} is ready!`);
                    }
                })
            }
        })
    })
}

function everyMinute(client) {
    checkIfTimerReady(client, 'hourlies', 3600, 'hourly');
    checkIfTimerReady(client, 'dailies', 86400, 'daily');
}
exports.everyMinute = everyMinute;