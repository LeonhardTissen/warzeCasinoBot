const { registerCommand } = require("../commands");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");

function balance(message, target) {
    // Set self as target if not provided
    target = parseUser(target, message.author.id);
    if (!target) {
        send(message, `Invalid target`);
        return;
    }

    createRowIfNotExists(target);

    // Get the users balance
    db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Send the user's balance as a response
        const balance = row.balance;
  
        send(message, `<@${target}>'s Balance: **${balance} ${emojis.diamond}**`);
    });
}
registerCommand(balance, "Check your balance.", ['balance', 'bal', 'b']);