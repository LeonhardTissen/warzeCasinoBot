const { registerCommand } = require("../commands");

function casino2Rules(message) {
	message.channel.send('https://s.warze.org/casino2rules.png');
}

registerCommand(casino2Rules, "Shows the Casino 2 rules", ['casino2rules', 'c2r'], "");