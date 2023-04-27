const { cmdBalance, cmdSetBalance } = require('./commands/balance');
const { cmdCasino2Test, cmdCasino2CardToggle, cmdCasino2CardSwap } = require('./commands/casino2');

const { createClient } = require('./utils/client');
const { TOKEN } = require('./utils/env');

const { getNums } = require('./utils/numchoice');
const { parseUser } = require('./utils/usertarget');

// Prefix for all commands
const PREFIX = '-';

const client = createClient();

global.ongoing_games = {};

// Event handler for when a message is received
client.on('messageCreate', (message) => {

	// Ignore messages from bots
	if (message.author.bot) return;

	// Only act on commands starting with the prefix
	if (!message.content.startsWith(PREFIX)) return;

	const cmd = message.content.substring(1).toLowerCase().split(' ');
	const cmd_numbers = getNums(cmd[0]);

	switch (cmd[0]) {
		case 'b': case 'bal': case 'balance':
			cmdBalance(message, parseUser(cmd[1]));
			break;
		case 'sb': case 'setbal': case 'setbalance':
			cmdSetBalance(message, parseInt(cmd[1]), parseUser(cmd[2]));
			break;
		case 'c2t': case 'casino2test':
			cmdCasino2Test(message);
			break;
		case 'swap':
			cmdCasino2CardSwap(message);
			break;
	};
	if (cmd_numbers.length > 0) {
		cmdCasino2CardToggle(message, cmd_numbers);
	}
	
	// db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [message.author.id], (err) => {
	// db.run('UPDATE users SET balance = balance + 1 WHERE id = ?', [message.author.id], (err) => {
	// db.run('UPDATE users SET balance = balance - 1 WHERE id = ?', [message.author.id], (err) => {
});

// Log in the bot using the token
client.login(TOKEN);