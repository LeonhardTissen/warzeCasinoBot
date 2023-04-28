const { emojis } = require("./emojis");
const { send } = require("./sender");

// Check if a bet is high enough to meet the requirements of a gambling command
function validateBetAmount(message, betamount, minimum = 1) {
    betamount = parseInt(betamount);
    if (betamount < minimum) {
        send(message, `Your bet must be larger than >**${minimum}** ${emojis.diamond}`);
        return false;
    }
    if (isNaN(betamount)) {
        send(message, `You need to place a bet.`);
        return false;
    }
    return betamount;
}
exports.validateBetAmount = validateBetAmount;