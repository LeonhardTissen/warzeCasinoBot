const { registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const { emojis } = require("../utils/emojis");
const { isNumeric } = require("../utils/numchoice");
const { hasInInventory } = require("../utils/inventory");

function cmdSellCard(message, cardid, price, target) {
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

    if (!isNumeric(price)) {
        send(message, `Invalid price`);
        return;
    }
    if (parseInt(price) <= 0) {
        send(message, `The price must be atleast **>0** ${emojis.diamond}`);
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

    hasInInventory(message.author.id, 'customcard', 'owned', cardid).then((hasTheCard) => {
        if (!hasTheCard) {
            send(message, `You don't own that card.`)
            return;
        }
        getPrefix(recipient).then((prefix) => {
            // Send the request to the recipient
            message.channel.send(`<@${recipient}>, ${message.author.username} wants to sell you **${cardid}** for **${price}** ${emojis.diamond}.\nType ${prefix}req accept or ${prefix}req deny.`);
            
            ongoing_requests.push({
                sender: sender,
                recipient: recipient,
                type: "transfercard",
                amount: price,
                cardid: cardid
            })
        })
    })
};
registerCommand(cmdSellCard, "Sell a card to another player", ['sellcard'], "[cardid] [price] [@user]");