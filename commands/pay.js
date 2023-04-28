const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");

function cmdPay(message, amount, target) {
	// Check if the amount to be paid is valid
	amount = parseInt(amount);
	if (amount <= 0 || isNaN(amount)) {
		send(message, `Invalid amount`);
		return;
	};

	// Check if the target user is valid and not the author themselves
	target = parseUser(target, message.author.id);
	if (!target || target == message.author.id) {
		send(message, `Invalid target`);
		return;
	};

	// Confirm if the sender has enough diamonds first
	checkIfLarger(message.author.id, amount).then((success) => {
		if (!success) {
			send(message, `${emojis.geizeangry} You don't have that kinda money.`);
			return;
		}

		// Transfer the diamonds over
		changeBalance(target, amount);
		changeBalance(message.author.id, - amount);

		// Confirmation message
		send(message, `${emojis.geizehappy} Successfully given **${amount}** ${emojis.diamond} to <@${target}>`);
	});
}
registerCommand(cmdPay, "Pay someone else your diamonds.", ['pay', 'simp'], "[amount] [@user]");