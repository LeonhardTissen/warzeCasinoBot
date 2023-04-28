const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { parseUser } = require("../utils/usertarget");
const { isAdmin } = require("../utils/admin");
const { send } = require("../utils/sender");

function setBalance(message, amount, target) {
    if (!isAdmin(message)) {
        return;
    }

    // Set self as target if not provided
    if (!target) {
        target = message.author.id;
    }
    target = parseUser(target);

    if (!amount) {
        send(message, `Invalid amount.`)
        return
    }
    amount = parseInt(amount);

    db.run('UPDATE users SET balance = ? WHERE id = ?', [amount, target], (err) => {
        if (err) {
            console.error(err.message);
            return;
        }

        send(message, `<@${target}>'s Balance is now: **${amount} ${emojis.diamond}**`)
    });
}
registerCommand(setBalance, "Set a users balance.", ['setbalance', 'setbal'], "[amount] [@user?]", true);