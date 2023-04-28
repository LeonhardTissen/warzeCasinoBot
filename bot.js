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
	const args = message.content.substring(PREFIX.length).toLowerCase().split(' ');
	commands.forEach((command) => {
		// If the message matches any of the aliases, execute the corresponding function
		if (command.aliases.includes(args[0])) {
			command.func(message, args[1], args[2], args[3])
		}
	})
});

// Log in the bot using the token
client.login(TOKEN);