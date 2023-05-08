const { registerCommand } = require("../commands");
const { validateBetAmount } = require("../utils/bet");
const { send } = require("../utils/sender");
const { ongoing_requests, ongoing_games } = require("../utils/games");
const { parseUser } = require("../utils/usertarget");
const { getPrefix } = require("../utils/getprefix");
const { checkIfLarger } = require("../utils/currency");
const emojis = require('../emojis.json');

function cmdCn4Start(message, betamount, target) {
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
	
	// Check if the sender or recipient have ongoing games
	if (ongoing_games[sender]) {
		send(message, 'You already have an ongoing game!');
		return;
	}
	if (ongoing_games[recipient]) {
		send(message, `<@${recipient}> already has an ongoing game!`);
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

	// Validate bet amount, must be atleast 1
	betamount = validateBetAmount(message, betamount, 1);
	if (!betamount) {
		return;
	}

    checkIfLarger(sender, betamount).then((success) => {
		if (!success) {
			send(message, `You don't have enough diamonds ${emojis.diamond}.`);
			return;
		}
		
		checkIfLarger(recipient, betamount).then((success) => {
			if (!success) {
				send(message, `<@${recipient}> doesn't have enough diamonds ${emojis.diamond}.`);
				return;
			}
			getPrefix(recipient).then((prefix) => {
				message.channel.send(`<@${recipient}>, ${message.author.username} wants to play a game of Connect 4 with you for **${betamount}** ${emojis.diamond}.\nType ${prefix}req accept or ${prefix}req deny.`);
			})

			ongoing_requests.push({
				sender: sender,
				recipient: recipient,
				type: "connect4",
				amount: betamount
			})
		})
	});
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(cmdCn4Start, "Start a Connect 4 game with another player", ['connect4', 'cn4'], "[amount] [2nd player]");