const { isAdmin } = require("../utils/admin");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/general");

function balance(message, target) {
    // Set self as target if not provided
    if (!target) {
        target = message.author.id;
    };

    db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Send the user's balance as a response
        const balance = row ? row.balance : 0;
  
        send(message, `<@${target}>'s Balance: **${balance} ${emojis.diamond}**`);
    });
}
exports.cmdBalance = balance;

function setBalance(message, amount, target) {
    if (!isAdmin(message)) {
        return;
    };

    // Set self as target if not provided
    if (!target) {
        target = message.author.id;
    };
    if (!amount) {
        send(message, `Invalid amount.`)
        return
    }

    db.run('UPDATE users SET balance = ? WHERE id = ?', [amount, target], (err) => {
        if (err) {
            console.error(err.message);
            return;
        }

        send(message, `<@${target}>'s Balance is now: **${amount} ${emojis.diamond}**`)
    });
}
exports.cmdSetBalance = setBalance;