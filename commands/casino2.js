const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { randRange } = require("../utils/general");
const { createCanvas, loadImage } = require('canvas');
const { send, sendCvs } = require("../utils/sender");

function randCard() {
	const id = 'card' + randRange(1,6);
	return {
		emoji: emojis[id],
		cardid: id
	}
}

class C2Card {
	constructor(position) {
		this.face = randCard();
		this.shown = true;
		this.position = position;
	}
	toggle() {
		this.shown = !this.shown;
	}
}

class C2Deck {
	constructor() {
		this.cards = [
			new C2Card(1),
			new C2Card(2),
			new C2Card(3),
			new C2Card(4),
			new C2Card(5)
		]
	}
	canvas(message) {
		const cvs = createCanvas(248, 72);
    	const ctx = cvs.getContext('2d');
		
		this.cards.forEach((card) => {
			let filename = card.shown ? card.face.cardid : 'cardclosed';
			loadImage('images/' + filename + '.png').then((img) => {
				ctx.drawImage(img, (card.position - 1) * 50, 0);
			})
		});

		setTimeout(() => {
			sendCvs(message, cvs);
		}, 100)
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
	game.state.player1.deck.canvas(message);
}
registerCommand(casino2Test, "Test Command for the Casino 2 game", ['casino2test', 'c2t']);

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
			cgame.state.player1.deck.canvas(message);
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
			cgame.state.player1.deck.canvas(message);
		} else {
			send(message, 'You already swapped this round!')
		}

	}
}
registerCommand(casino2CardSwap, "Test Command for the Casino 2 game", ['swap']);