const { registerCommand } = require("../commands");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { getSecUntilDaily } = require("../utils/secuntildaily");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const { getPrefix } = require("../utils/getprefix");

function balance(message, target) {
    // Set self as target if not provided
    target = parseUser(target, message.author.id);
    if (!target) {
        send(message, `Invalid target`);
        return;
    }

    createRowIfNotExists(target, 'users');

    // Get the users balance
    db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Send the user's balance as a response
        const balance = row.balance;
        
        getSecUntilDaily(target).then((seconds) => {
            getPrefix(target).then((preferred_prefix) => {
                let added_message = '';
                if (seconds <= 0) {
                    added_message = `\n*(Collect your ${preferred_prefix}daily to receive **1000** ${emojis.diamond})*`
                }
                send(message, `<@${target}>'s Balance: **${balance} ${emojis.diamond}**${added_message}`);
            })
        })
    });
}
registerCommand(balance, "Check your balance.", ['balance', 'bal', 'b'], "[@user?]");