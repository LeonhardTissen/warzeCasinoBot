const { isAdmin } = require("../utils/admin");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/general");

function balance(message) {
    db.get('SELECT balance FROM users WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Send the user's balance as a response
        const balance = row ? row.balance : 0;
  
        send(message, `<@${message.author.id}>'s Balance: **${balance} ${emojis.diamond}**`);
    });
}
exports.cmdBalance = balance;

function setBalance(message, amount) {
    if (!isAdmin(message)) {
        return;
    };
    db.run('UPDATE users SET balance = ? WHERE id = ?', [amount, message.author.id], (err) => {
        if (err) {
            console.error(err.message);
            return;
        }

        send(message, `<@${message.author.id}>'s Balance is now: **${amount} ${emojis.diamond}**`)
    });
}
exports.cmdSetBalance = setBalance;