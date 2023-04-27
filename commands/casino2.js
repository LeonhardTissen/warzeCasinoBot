const { emojis } = require("../utils/emojis");
const { randRange, send } = require("../utils/general");

function randCard() {
	return emojis['card' + randRange(1,6)]
}

class C2Card {
	constructor() {
		this.face = randCard();
		this.shown = true;
	}
	string() {
		return (this.shown ? this.face : emojis.cardclosed);
	}
	toggle() {
		this.shown = !this.shown;
	}
}
exports.C2Card = C2Card;

class C2Deck {
	constructor() {
		this.cards = [
			new C2Card(),
			new C2Card(),
			new C2Card(),
			new C2Card(),
			new C2Card()
		]
	}
	string() {
		let final = '';
		this.cards.forEach((card) => {
			final += card.string();
		});
		return final;
	}
	toggleSingleCard(id) {
		this.cards[id].toggle();
	}
	cardSwap() {
		this.cards.forEach((card) => {
			if (!card.shown) {
				card.shown = true;
				card.face = randCard();
			}
		})
	}
}
exports.C2Deck = C2Deck;

function casino2Test(message) {
	if (ongoing_games[message.author.id]) {
		send(message, 'You already have an ongoing game!');
		return;
	}
	const game = {
		type: 'casino2',
		state: {
			player1: {
				deck: new C2Deck(),
				swapped: false
			}
		}
	}
	ongoing_games[message.author.id] = game;

	send(message, `You started a new game, here's your **Deck**:`);

	// Send the current deck
	message.channel.send(game.state.player1.deck.string());
}
exports.cmdCasino2Test = casino2Test;

function casino2CardToggle(message, indices) {
	const cgame = ongoing_games[message.author.id];

	if (cgame && cgame.type === 'casino2') {
		
		if (!cgame.state.player1.swapped) {
			// Toggle all cards at indices
			indices.forEach((index) => {
				if (index >= 1 && index <= 5) {
					cgame.state.player1.deck.toggleSingleCard(index - 1);
				}
			})

			// Send the current deck
			message.channel.send(cgame.state.player1.deck.string())
		} else {
			send(message, 'You already swapped this round!')
		}

	}
}
exports.cmdCasino2CardToggle = casino2CardToggle;

function casino2CardSwap(message) {
	const cgame = ongoing_games[message.author.id];

	if (cgame && cgame.type === 'casino2') {

		if (!cgame.state.player1.swapped) {
			cgame.state.player1.deck.cardSwap();
			cgame.state.player1.swapped = true;

			// Send the current deck
			message.channel.send(cgame.state.player1.deck.string())
		} else {
			send(message, 'You already swapped this round!')
		}


	}
}
exports.cmdCasino2CardSwap = casino2CardSwap;