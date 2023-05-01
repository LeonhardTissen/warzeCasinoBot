const { db } = require("./db");

// Seconds to wait after collecting daily
const sec_hourly = 3600;

function getSecUntilHourly(target) {
    return new Promise((resolve) => {
        // Insert user into hourlies db if not exists
        db.run('INSERT OR IGNORE INTO hourlies (id) VALUES (?)', [target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }

            // Retrieve the last Hourly of the user
            db.get('SELECT last FROM hourlies WHERE id = ?', [target], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                
                // Determine how long it takes for the next hourly, if negative it's ready
                const now = Math.floor(Date.now() / 1000);
                const last = row ? row.last : 0;
        
                resolve(last + sec_hourly - now)
            })
        })
    })
}
exports.getSecUntilHourly = getSecUntilHourly;