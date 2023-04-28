const { commands } = require('./commands');
const { createClient } = require('./utils/client');
const { TOKEN, PREFIX, CHANNEL } = require('./utils/env');

const client = createClient();

// Event handler for when a message is received
client.on('messageCreate', (message) => {

	// Ignore messages from bots
	if (message.author.bot) return;

	// Ignore messages outside of the designated channel
	if (message.channel.id != CHANNEL) return;

	// Only act on commands starting with the prefix
	if (!message.content.startsWith(PREFIX)) return;

	// Convert message to lowercase array and go through all the registered commands
	const cmd = message.content.substring(PREFIX.length).toLowerCase().split(' ');
	commands.forEach((item) => {
		// If the message matches any of the aliases, execute the corresponding function
		if (item.aliases.includes(cmd[0])) {
			item.func(message, cmd[1], cmd[2], cmd[3])
		}
	})
});

// Log in the bot using the token
client.login(TOKEN);