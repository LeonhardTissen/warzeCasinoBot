const { registerCommand } = require("../commands");
const { validateAmount } = require("../utils/bet");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const emojis = require('../emojis.json');
const { send } = require("../utils/sender");
const { parseUser } = require("../utils/usertarget");

function cmdPay(message, amount, target) {
	// Check if the amount to be paid is valid
	amount = validateAmount(message, amount);
	if (amount === false) return;

	// Check if the amount is large enough to warrant payment
	if (amount < 1) {
		send(message, `Your payment must be larger than **>1** ${emojis.diamond}.`);
		return;
	}

	// Check if the target user is valid
	target = parseUser(target, message.author.id);
	if (!target) {
		send(message, `Invalid target.`);
		return;
	}

	// Check if the target is the author, in which case prevent it
	if (target == message.author.id) {
		send(message, `You can't pay yourself, silly.`);
		return;
	}

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
registerCommand(cmdPay, "Pay someone else your diamonds", ['pay', 'simp'], "[amount] [@user]");