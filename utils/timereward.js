const { db } = require("./db");

function getSecUntilReward(target, table, offset) {
    return new Promise((resolve) => {
        // Insert user into table if not exists
        db.run(`INSERT OR IGNORE INTO ${table} (id) VALUES (?)`, [target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }

            // Retrieve the last redeem of the user
            db.get(`SELECT last FROM ${table} WHERE id = ?`, [target], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                
                // Determine how long it takes for the next reward, if negative it's ready
                const now = Math.floor(Date.now() / 1000);
                const last = row ? row.last : 0;
        
                resolve(last + offset - now)
            })
        })
    })
}
exports.getSecUntilReward = getSecUntilReward;