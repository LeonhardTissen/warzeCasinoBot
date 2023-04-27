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
  
        // Send the embed message
        send(message, `<@${message.author.id}>'s Balance: **${balance} ${emojis.diamond}**`);
    });
}

exports.cmdBalance = balance;