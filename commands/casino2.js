const { registerCommand } = require("../commands");
const { emojis } = require("../utils/emojis");
const { randRange } = require("../utils/general");
const { createCanvas } = require('canvas');
const { send, sendCvs } = require("../utils/sender");
const { assets } = require("../utils/images");

function randCard() {
	const num = randRange(1,6);
	const id = 'card' + num;
	return {
		emoji: emojis[id],
		cardid: id,
		idnum: num - 1
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
			
			ctx.drawImage(assets[filename], (card.position - 1) * 50, 0);
		});
		sendCvs(message, cvs);
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
	getSummarized(ordered) {
		let score = 0;
		let counts = [0, 0, 0, 0, 0, 0];

		this.cards.forEach((card) => {
			counts[card.face.idnum] ++;
			score = Math.max(score, card.face.idnum);
		})

		if (ordered) {
			counts = counts.sort().reverse();
		}

		return {score, counts};
	}
	getScore() {
		const summary = this.getSummarized(true);
		let score = summary.score;
		const ordered = summary.counts;

		if (ordered[0] === 5) {
			score += 60;
		} else if (ordered[0] === 4) {
			score += 50;
		} else if (ordered[0] === 3 && ordered[1] === 2) {
			score += 40;
		} else if (ordered[0] === 3) {
			score += 30;
		} else if (ordered[0] === 2 && ordered[1] === 2) {
			score += 20;
		} else if (ordered[0] === 2) {
			score += 10;
		}

		return score
	}
	autoSolve(message) {
		send(message, `${emojis.geizehappy} My turn!`);
		this.canvas(message);

		const summary = this.getSummarized(false).counts;

		for (let i = 0; i < 5; i ++) {
			if (summary[this.cards[i].face.idnum] === 1) {
				this.toggleSingleCard(i);
			}
		}
		
		this.canvas(message);
		this.cardSwap();
		this.canvas(message);
		const opponent_score = this.getScore();
		return opponent_score;
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

			setTimeout(function() {
				const aideck = new C2Deck()
	
				const opponent_score = aideck.autoSolve(message);
				const your_score = cgame.state.player1.deck.getScore();
				setTimeout(function() {
					if (your_score > opponent_score) {
						send(message, emojis.geizesleep + ' You won... this time.');
					} else {
						send(message, emojis.geizehappy + ' Ya lost, DUMBASS!');
					}
					delete ongoing_games[message.author.id];
				})
			}, 500)
		} else {
			send(message, 'You already swapped this round!')
		}

	}
}
registerCommand(casino2CardSwap, "Test Command for the Casino 2 game", ['swap']);