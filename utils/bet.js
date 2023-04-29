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

// Check if an amount is valid
function validateAmount(message, amount) {
    amount = parseInt(amount);
    if (amount < 0) {
        send(message, `Your amount must be larger than >**0** ${emojis.diamond}`)
        return false;
    }
    if (isNaN(amount)) {
        send(message, `You need to provide a valid amount.`);
        return false;
    }
    return amount;
}
exports.validateAmount = validateAmount;