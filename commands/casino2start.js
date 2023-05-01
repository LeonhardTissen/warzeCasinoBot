const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { changeBalance, checkIfLarger } = require("../utils/currency");
const { validateBetAmount } = require("../utils/bet");
const { C2Deck } = require("../utils/casino2deck");
const { ongoing_games } = require("../utils/games");
const { CvsBundler } = require("../utils/cvsbundler");
const { getCanvasHead, getCanvasFooter } = require("../utils/canvashead");
const { getPrefix } = require("../utils/getprefix");

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
					deck: new C2Deck(),
					swapped: false,
					bet: betamount,
					opponent: "AI"
				}
			}
			ongoing_games[message.author.id] = game;
		
			// Send the current deck
			getPrefix(message.author.id).then((prefix) => {
				const cvs = new CvsBundler(5);
				cvs.add(getCanvasHead(248, `${message.author.username}'s Deck:`));
	
				cvs.add(game.state.deck.canvas());
	
				cvs.add(getCanvasFooter(248, `Ex: ${prefix}swap 135`));
	
				cvs.send(message);
			});
		})
	})
}
registerCommand(casino2Start, "Start a Casino 2 game", ['casino2', 'c2t', 'c2'], "[amount]");