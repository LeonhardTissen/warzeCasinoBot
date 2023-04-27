const { commands } = require('./commands');
require('./commands/balance');
require('./commands/setbalance');
require('./commands/canvas');
const { cmdCasino2CardToggle } = require('./commands/casino2');
require('./commands/coinflip');
require('./commands/daily');
require('./commands/help');

const { createClient } = require('./utils/client');
const { TOKEN, PREFIX } = require('./utils/env');

const { getNums } = require('./utils/numchoice');

const client = createClient();

global.ongoing_games = {};

// Event handler for when a message is received
client.on('messageCreate', (message) => {

	// Ignore messages from bots
	if (message.author.bot) return;

	// Only act on commands starting with the prefix
	if (!message.content.startsWith(PREFIX)) return;

	const cmd = message.content.substring(1).toLowerCase().split(' ');
	commands.forEach((item) => {
		if (item.aliases.includes(cmd[0])) {
			item.func(message, cmd[1], cmd[2], cmd[3])
		}
	})

	const cmd_numbers = getNums(cmd[0]);
	if (cmd_numbers.length > 0) {
		cmdCasino2CardToggle(message, cmd_numbers);
	}
});

// Log in the bot using the token
client.login(TOKEN);