const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { changeBalance, checkIfLarger } = require("../utils/currency");
const { validateBetAmount } = require("../utils/bet");
const { startGame } = require("../utils/casino2deck");
const { ongoing_games } = require("../utils/games");

function casino2Start(message, betamount) {
	// Users can only partake in 1 game at a time
	if (ongoing_games[message.author.id]) {
		send(message, 'You already have an ongoing game!');
		return;
	}

	// Validate bet amount, must be atleast 1
	betamount = validateBetAmount(message, betamount, 1);
	if (!betamount) {
		return;
	}

	checkIfLarger(message.author.id, betamount).then((success) => {
		if (!success) {
			send(message, `You don't have enough diamonds ${emojis.diamond}.`);
			return;
		}

		changeBalance(message.author.id, - betamount).then(() => {
			startGame(message, message.author.id, 'AI', betamount);
		})
	})
}
registerCommand(casino2Start, "Start a Casino 2 game with Geize", ['casino2', 'c2'], "[amount]");