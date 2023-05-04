const { registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const { emojis } = require("../utils/emojis");
const { isNumeric } = require("../utils/numchoice");
const { pluralS } = require("../utils/timestr");
const { db, createRowIfNotExists } = require("../utils/db");

function cmdSellChest(message, amount, price, target) {
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

    // Validate quantity
    let chestamount = 1;
    if (isNumeric(amount)) {
        chestamount = amount;
    }
    if (chestamount <= 0) {
        send(message, `That doesn't make any sense, does it?`);
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

    createRowIfNotExists(sender, 'redchest');

    db.get('SELECT redchest FROM redchest WHERE id = ?', [sender], (err, row) => {
        if (err) {
            console.log(err);
            return;
        }

        if (row.redchest < chestamount) {
            send(message, `<@${sender}>, you don't have enough **Red Chests** ${emojis.redchest}`);
            return;
        }

        getPrefix(recipient).then((prefix) => {
            // Send the request to the recipient
            message.channel.send(`<@${recipient}>, ${message.author.username} wants to sell you **${chestamount} Red Chest${pluralS(chestamount)}** ${emojis.redchest} for **${price}** ${emojis.diamond}.\nType ${prefix}req accept or ${prefix}req deny.`);
            
            ongoing_requests.push({
                sender: sender,
                recipient: recipient,
                type: "transferredchest",
                amount: price,
                quantity: chestamount
            })
        })
    })
};
registerCommand(cmdSellChest, "Sell a chest to another player", ['sellchest'], "[amount] [price] [@user]");