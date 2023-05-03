const { registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const { emojis } = require("../utils/emojis");

function cmdSellChest(message, price, target) {
	// Validate recipient
	const recipient = parseUser(target);
	const sender = message.author.id;
	if (!recipient) {
		send(message, `Invalid target`);
		return;
	}
	if (recipient === sender) {
		send(message, `You can't play against yourself.`);
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
        };
    })
    if (has_ongoing) return;

    getPrefix(recipient).then((prefix) => {
        message.channel.send(`<@${recipient}>, ${message.author.username} wants to sell you a **Red Chest** ${emojis.redchest} for **${price}** ${emojis.diamond}.\nType ${prefix}req accept or ${prefix}req deny.`);
        
        ongoing_requests.push({
            sender: sender,
            recipient: recipient,
            type: "transferredchest",
            amount: price
        })
    })
};
registerCommand(cmdSellChest, "Sell a chest to another player", ['sellchest'], "[amount] [@user]");