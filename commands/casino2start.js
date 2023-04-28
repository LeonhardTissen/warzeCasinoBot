const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { changeBalance, checkIfLarger } = require("../utils/currency");
const { validateBetAmount } = require("../utils/bet");
const { C2Deck } = require("../utils/casino2deck");
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

		changeBalance(message.author.id, - betamount).then((success) => {
			const game = {
				type: 'casino2',
				state: {
					player1: {
						deck: new C2Deck(),
						swapped: false,
						bet: betamount
					}
				}
			}
			ongoing_games[message.author.id] = game;
		
			send(message, `You started a new game, here's your **Deck**:`);
		
			// Send the current deck
			game.state.player1.deck.canvas(message);
		})
	})
}
registerCommand(casino2Start, "Start a Casino 2 game", ['casino2', 'c2t', 'c2'], "[amount]");