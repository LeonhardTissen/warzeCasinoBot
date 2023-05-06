const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { lottery } = require("../utils/lottery");
const { send } = require("../utils/sender");
const { emojis } = require("../utils/emojis");
const { addToStat } = require("../utils/stats");

function cmdLottery(message, amount, duration) {

    if (!amount) {
        send(message, `No ticket amount provided`);
        return;
    }
    amount = parseInt(amount);
    if (amount <= 0) {
        send(message, `Invalid ticket amount`);
        return;
    }

    if (!lottery.ongoing) {
        duration = parseInt(duration);
        if (isNaN(duration)) {
            send(message, `No duration specified. Duration must be **1-60**`);
            return;
        }
        if (duration <= 0 || duration > 60) {
            send(message, `Invalid duration, must be **1-60**.`);
            return;
        }
    }

    // Total purchase price
    const total_price = amount * 10;

    checkIfLarger(message.author.id, total_price).then((canBuy) => {
        if (!canBuy) {
            send(message, `<@${message.author.id}>, you don't have enough **diamonds** ${emojis.diamond}. You need **${total_price}** ${emojis.diamond}.`)
            return;
        }

        // Remove balance from the user
        changeBalance(message.author.id, - total_price);

        // Add ticket count to the statistic of the user
        addToStat('lotterytickets', message.author.id, amount);

        lottery.addtickets(message, message.author.id, amount, duration)
    })
}

registerCommand(cmdLottery, "Start or partake in a lottery", ['lottery', 'lot'], "[amount] [duration?]", false, false);