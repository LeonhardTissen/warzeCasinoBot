const { emojis } = require("./emojis");
const { randRange } = require("./general");

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
}
exports.C2Deck = C2Deck;