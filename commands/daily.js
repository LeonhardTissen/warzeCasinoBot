const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/general");
const { secToReadable } = require("../utils/timestr");

const daily_amount = 100;
const sec_daily = 600 //86400;

function daily(message) {
    // Target is always author
    const target = message.author.id;

    db.get('SELECT last FROM dailies WHERE id = ?', [target], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        const last = row ? row.last : 0;

        const now = Math.floor(Date.now() / 1000);
        console.log(last, now)
        if (now > last + sec_daily) {
            
            // Reward daily
            const resulting_balance_change = daily_amount;
            db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [resulting_balance_change, target], (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
    
                send(message, `<@${target}>, you collected: **${daily_amount} ${emojis.diamond}**`);

            });
            
            // Insert user
            db.run('INSERT OR IGNORE INTO dailies (id) VALUES (?)', [target], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });

            // Apply a timer that the user has to wait before collecting the next daily
            db.run('UPDATE dailies SET last = ? WHERE id = ?', [now, target], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            })

        } else {
            const to_wait = sec_daily - (now - last)
            send(message, `<@${target}>, you need to wait **${secToReadable(to_wait)}**.`);
        }

    });
}
exports.cmdDaily = daily;