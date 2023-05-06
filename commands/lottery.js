const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { lottery } = require("../utils/lottery");
const { send } = require("../utils/sender");
const { emojis } = require("../utils/emojis");

function cmdLottery(message, amount) {

    if (!amount) {
        send(message, `No ticket amount provided`);
        return;
    }
    amount = parseInt(amount);
    if (amount <= 0) {
        send(message, `Invalid ticket amount`);
        return;
    }

    // Total purchase price
    const total_price = amount * 10;

    checkIfLarger(message.author.id, total_price).then((canBuy) => {
        if (!canBuy) {
            send(message, `<@${message.author.id}>, you don't have enough **diamonds** ${emojis.diamond}. You need **${total_price}** ${emojis.diamond}.`)
            return;
        }

        changeBalance(message.author.id, - total_price);

        lottery.addtickets(message, message.author.id, amount)
    })
}

registerCommand(cmdLottery, "Start or partake in a lottery", ['lottery', 'lot'], "[amount]", false, false);