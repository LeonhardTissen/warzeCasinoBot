const { sendCvs, send } = require("./sender");
const { assets } = require('./images')
const { randRange } = require("../utils/random");
const { createCanvas } = require('canvas');
const { emojis } = require("./emojis");
const { CvsBundler } = require("./cvsbundler");

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
	canvas(message = false) {
		// Send a canvas representation of the deck
		const cvs = createCanvas(248, 72);
    	const ctx = cvs.getContext('2d');
		
		this.cards.forEach((card) => {
			let filename = card.shown ? card.face.cardid : 'cardclosed';
			
			ctx.drawImage(assets[filename], (card.position - 1) * 50, 0);
		});
		if (message) {
			sendCvs(message, cvs);
		} else {
			return cvs;
		}
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
	getSummarized() {
		// Count the cards depending on type
		let counts = new Array(6).fill(0);

		this.cards.forEach((card) => {
			counts[card.face.idnum] ++;
		})

		return counts;
	}
	getScore() {
		// How much worth the deck is to compare
		const summary = this.getSummarized();
		let score = 0;

		// Make a copy of the array that is sorted with biggest card combos at the start
		const ordered_counts = JSON.parse(JSON.stringify(summary)).sort().reverse();

		// Determine the strength of the build
		if (ordered_counts[0] === 5) {
			score += 60;
		} else if (ordered_counts[0] === 4) {
			score += 50;
		} else if (ordered_counts[0] === 3 && ordered_counts[1] === 2) {
			score += 40;
		} else if (ordered_counts[0] === 3) {
			score += 30;
		} else if (ordered_counts[0] === 2 && ordered_counts[1] === 2) {
			score += 20;
		} else if (ordered_counts[0] === 2) {
			score += 10;
		}

		// Check the highest card and add it to the score for a tiebreaker
		let highest_card = 0;
		for (let i = 0; i < 6; i ++) {
			if (summary[i] > 1) {
				highest_card = Math.max(highest_card, i + 1);
			}
		}
		score += highest_card;

		return score
	}
	autoSolve(message) {
		// AI Geize does these actions
		return new Promise((resolve) => {
			// Message indicating that the master is at work
			send(message, `${emojis.geizehappy} My turn!`);

			// Shows his current deck before any actions were taken
			const cvs = new CvsBundler(5);
			cvs.add(this.canvas());
	
			// Geize turns cards around that only appear once
			const summary = this.getSummarized();
			for (let i = 0; i < 5; i ++) {
				if (summary[this.cards[i].face.idnum] === 1) {
					this.toggleSingleCard(i);
				}
			}
			// Show his deck before swapping and after swapping
			cvs.add(this.canvas());
			this.cardSwap();
			cvs.add(this.canvas());
			cvs.send(message);

			// Return the score of Geize's deck
			resolve(this.getScore());
		})
	}
}
exports.C2Deck = C2Deck;