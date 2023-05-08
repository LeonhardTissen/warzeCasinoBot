const { registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const emojis = require('../emojis.json');
const { isNumeric } = require("../utils/numchoice");
const { pluralS } = require("../utils/timestr");
const { createRowIfNotExists } = require("../utils/db");
const { getChests, valid_chest_colors } = require("../utils/chests");
const { capitalize } = require("../utils/capitalize");

function cmdSellChest(message, amount, color, price, target) {
	// Validate recipient
	const recipient = parseUser(target);
	const sender = message.author.id;
	if (!recipient) {
		send(message, `Invalid target`);
		return;
	}
	if (recipient === sender) {
		send(message, `You can't sell to yourself.`);
		return;
	}

    // Validate chest color
    if (!valid_chest_colors.includes(color)) {
        send(message, `Invalid chest color. Valid: **${valid_chest_colors.join(', ')}**`)
        return;
    }

    // Validate quantity
    let chestamount = 1;
    if (isNumeric(amount)) {
        chestamount = amount;
    }
    if (chestamount <= 0) {
        send(message, `That doesn't make any sense, does it?`);
        return;
    }
    if (!isNumeric(price)) {
        send(message, `Invalid price`);
        return;
    }
    if (parseInt(price) <= 0) {
        send(message, `The price must be atleast **>1** ${emojis.diamond}`);
        return;
    }

    // Check if the sender or recipient have ongoing requests
    let has_ongoing = false;
    ongoing_requests.forEach((request) => {
        if (request.recipient === sender || request.sender === sender) {
            send(message, 'You already have an ongoing request!');
            has_ongoing = true;
        } else if (request.recipient === recipient || request.sender === recipient) {
            send(message, `<@${recipient}> already has an ongoing request!`);
            has_ongoing = true;
        }
    })
    if (has_ongoing) return;

    createRowIfNotExists(sender, `${color}chest`);

    getChests(sender, [color]).then((chests) => {

        if (chests[color] < chestamount) {
            send(message, `<@${sender}>, you don't have enough **${capitalize(color)} Chests** ${emojis[color + 'chest']}`);
            return;
        }

        getPrefix(recipient).then((prefix) => {
            // Send the request to the recipient
            const emoji = emojis[color + 'chest'];
            message.channel.send(`<@${recipient}>, ${message.author.username} wants to sell you **${chestamount} ${capitalize(color)} Chest${pluralS(chestamount)}** ${emoji} for **${price}** ${emojis.diamond}.\nType ${prefix}req accept or ${prefix}req deny.`);
            
            ongoing_requests.push({
                sender: sender,
                recipient: recipient,
                type: "transferchest",
                amount: price,
                quantity: chestamount,
                color: color
            })
        })
    })
};
registerCommand(cmdSellChest, "Sell a chest to another player", ['sellchest'], "[amount] [color] [price] [@user]");