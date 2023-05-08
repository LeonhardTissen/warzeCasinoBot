const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { lottery } = require("../utils/lottery");
const { send } = require("../utils/sender");
const emojis = require('../emojis.json');
const { addToStat } = require("../utils/stats");

function cmdLottery(message, amount, duration, maxtickets) {

    // Validate ticket amount
    if (!amount) {
        send(message, `No ticket amount provided`);
        return;
    }
    amount = parseInt(amount);
    if (amount <= 0) {
        send(message, `Invalid ticket amount`);
        return;
    }

    // Default maxtickets = 0
    if (!maxtickets) {
        maxtickets = 0;
    } else {
        maxtickets = parseInt(maxtickets);
        if (maxtickets < 10) {
            send(message, `Minimum tickets must be atleast **>10**`)
            return;
        }
    }

    if (!lottery.ongoing) {
        duration = parseInt(duration);
        if (isNaN(duration)) {
            send(message, `No duration specified. Duration must be **1-360** (minutes)`);
            return;
        }
        if (duration <= 0 || duration > 360) {
            send(message, `Invalid duration, must be **1-360** (minutes)`);
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

        lottery.addtickets(message, message.author.id, amount, duration, maxtickets)
    })
}

registerCommand(cmdLottery, "Start or partake in a lottery", ['lottery', 'lot'], "[amount] [minutes?] [maxtickets?]", false, false);