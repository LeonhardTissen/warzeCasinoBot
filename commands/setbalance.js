const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { parseUser } = require("../utils/usertarget");
const { isAdmin } = require("../utils/admin");
const { send } = require("../utils/sender");
const { setBalance } = require("../utils/currency");
const { validateAmount } = require("../utils/bet");

function cmdSetBalance(message, amount, target) {
    // Only admin can execute this command
    if (!isAdmin(message)) {
        return;
    }

    // Validate the target of the command, author if not provided
    target = parseUser(target, message.author.id);

    amount = validateAmount(message, amount);
    if (amount === false) return;

    // vince
    setBalance(target, amount);
    send(message, `<@${target}>'s Balance is now: **${amount} ${emojis.diamond}**`);
}
// The true at the end makes it an admin only command & changes the output of the help command
registerCommand(cmdSetBalance, "Set a users balance.", ['setbalance', 'setbal'], "[amount] [@user?]", true);