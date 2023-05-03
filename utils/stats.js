const { createRowIfNotExists, db } = require("./db");

function addToStat(type, user, amount) {
    return new Promise((resolve) => {
        createRowIfNotExists(user, 'stats' + type);
        db.get(`SELECT ${type} FROM stats${type} WHERE id = ?`, [user], (err, row) => {
            if (err) {
                console.log(err);
                return;
            }

            if (!row) {
                console.log(row);
                return;
            }

            const value = row[type] + amount;

            db.run(`UPDATE stats${type} SET ${type} = ? WHERE id = ?`, [value, user], (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve();
            })
        });
    })
}
exports.addToStat = addToStat;

function getStat(type, user) {
    return new Promise((resolve) => {
        db.get(`SELECT ${type} FROM stats${type} WHERE id = ?`, [user], (err, row) => {
            if (err) {
                console.log(err);
                resolve(0);
                return;
            };

            // Return 0 if no data
            if (!row || !row[type]) {
                resolve(0);
                return;
            }
            resolve(row[type]);
        })
    })
}
exports.getStat = getStat;