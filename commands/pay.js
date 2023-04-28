const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");

function cmdPay(message, amount, target) {
	amount = parseInt(amount);
	target = parseUser(target);
	if (amount <= 0 || isNaN(amount)) {
		send(message, `Invalid amount`);
		return;
	};
	checkIfLarger(message.author.id, amount).then((success) => {
		if (!success) {
			send(message, `${emojis.geizeangry} You don't have that kinda money.`);
			return;
		}

		changeBalance(target, amount);
		changeBalance(message.author.id, - amount);
		send(message, `${emojis.geizehappy} Successfully given **${amount}** ${emojis.diamond} to <@${target}>`);
	});
}
registerCommand(cmdPay, "Pay someone else your diamonds.", ['pay', 'simp']);