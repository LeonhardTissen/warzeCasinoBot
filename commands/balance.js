const { registerCommand } = require("../commands");
const { isAdmin } = require("../utils/admin");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/general");
const { parseUser } = require("../utils/usertarget");

function balance(message, target) {
    // Set self as target if not provided
    if (!target) {
        target = message.author.id;
    } else {
        target = parseUser(target);
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