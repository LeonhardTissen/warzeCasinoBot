const { sendCvs, send } = require("./sender");
const { assets } = require('./images')
const { randRange } = require("../utils/general");
const { createCanvas } = require('canvas');
const { emojis } = require("./emojis");

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
		// Send a canvas representation of the deck
		const cvs = createCanvas(248, 72);
    	const ctx = cvs.getContext('2d');
		
		this.cards.forEach((card) => {
			let filename = card.shown ? card.face.cardid : 'cardclosed';
			
			ctx.drawImage(assets[filename], (card.position - 1) * 50, 0);
		});
		sendCvs(message, cvs);
	}
	toggleSingleCard(id) {
		// Turn a single card around and mark it to be swapped
		this.cards[id].toggle();
	}
	cardSwap() {
		// Swap out cards that were turned around, can only be done once per deck
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
		// How much worth the deck is to compare
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
		// AI Geize does these actions
		return new Promise((resolve) => {
			// Message indicating that the master is at work
			send(message, `${emojis.geizehappy} My turn!`);

			// Shows his current deck before any actions were taken
			this.canvas(message);
	
			// Geize turns cards around that only appear once
			const summary = this.getSummarized(false).counts;
			for (let i = 0; i < 5; i ++) {
				if (summary[this.cards[i].face.idnum] === 1) {
					this.toggleSingleCard(i);
				}
			}
			// Show his deck before swapping and after swapping
			this.canvas(message);
			this.cardSwap();
			this.canvas(message);

			// Return the score of Geize's deck
			resolve(this.getScore());
		})
	}
}
exports.C2Deck = C2Deck;