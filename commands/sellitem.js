const { registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");
const emojis = require('../emojis.json');
const { isNumeric } = require("../utils/numchoice");
const { hasInInventory, removeFromInventory } = require("../utils/inventory");
const { randChoice, randRange } = require("../utils/random");
const { changeBalance } = require("../utils/currency");

const weize_sell_msgs = [
    "Mmm, that's looking like a good one.",
    "Wow that one is so precious.",
    "I've been looking for this exact one.",
    "Nice, do you have more like that?",
    "That fits right into my collection.",
    "I love how this one looks.",
    "This one's a real rarity.",
    "Crazy that you'd sell this one."
]

function cmdSellCard(message, cardid, price, target) {
    // Validate cardid
    if (!cardid) {
        send(message, `No card ID provided.`);
        return;
    }

	// Validate recipient
	const recipient = parseUser(target);
	const sender = message.author.id;
	if (!recipient) {
        let cards_to_sell;

        if (cardid.includes(',')) {
            cards_to_sell = cardid.split(',');
        } else {
            cards_to_sell = [cardid];
        }

        cards_to_sell.forEach((card) => {
            hasInInventory(message.author.id, 'customcard', 'owned', card).then((hasTheCard) => {
                if (!hasTheCard) {
                    send(message, `You don't own that card.`)
                    return;
                }

                const sell_price = randRange(15, 120);

                // Weize gives a cute message while buying the users card
                send(message, `${emojis.geizehappy} ${randChoice(weize_sell_msgs)} **+${sell_price}** ${emojis.diamond}`);

                // Reward the user with a random number of diamonds
                changeBalance(message.author.id, sell_price);

                // Remove the card from their inventory
                removeFromInventory(message.author.id, 'customcard', 'owned', card);
            })
        })
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
registerCommand(cmdSellCard, "Sell a card to another player or to Weize", ['sellcard', 'sc'], "[cardid] [price] [@user?]");