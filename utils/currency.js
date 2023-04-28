const { db } = require("./db");

function checkIfLarger(target, comparedAmount) {
    if (comparedAmount < 0) {
        return true;
    }
    return new Promise((resolve) => {
        db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
    
            const balance = row ? row.balance : 0;

            resolve(balance >= comparedAmount)
        });
    })
}
exports.checkIfLarger = checkIfLarger;

function changeBalance(target, changeAmount) {
    return new Promise((resolve) => {
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [changeAmount, target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            resolve(true)
        });
    });
}
exports.changeBalance = changeBalance;