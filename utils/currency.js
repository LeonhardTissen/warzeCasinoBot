const { db } = require("./db");

function checkMinBalance(target, minAmount) {
    return new Promise((resolve) => {
        db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
    
            const balance = row ? row.balance : 0;

            resolve(balance >= minAmount)
        });
    })
}
exports.checkMinBalance = checkMinBalance;