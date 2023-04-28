const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { parseUser } = require("../utils/usertarget");
const { isAdmin } = require("../utils/admin");
const { send } = require("../utils/sender");

function setBalance(message, amount, target) {
    // Only admin can execute this command
    if (!isAdmin(message)) {
        return;
    }

    // Validate the target of the command, author if not provided
    if (!target) {
        target = message.author.id;
    }
    target = parseUser(target);

    // Validate amount of diamonds to grant
    if (!amount) {
        send(message, `Invalid amount.`)
        return
    }
    amount = parseInt(amount);

    // vince
    db.run('UPDATE users SET balance = ? WHERE id = ?', [amount, target], (err) => {
        if (err) {
            console.error(err.message);
            return;
        }

        send(message, `<@${target}>'s Balance is now: **${amount} ${emojis.diamond}**`)
    });
}
// The true at the end makes it an admin only command & changes the output of the help command
registerCommand(setBalance, "Set a users balance.", ['setbalance', 'setbal'], "[amount] [@user?]", true);