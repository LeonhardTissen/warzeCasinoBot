// Import the Discord.js library
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

// Load environment variables from .env file
require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

// Bot token from .env file
const TOKEN = process.env.TOKEN;

// Event handler for when the bot is ready
client.on('ready', () => {
	// Set bot's status to streaming
	client.user.setActivity({
		name: "on Warze.org",
		type: ActivityType.Streaming,
		url: "https://twitch.tv/warzedev",
	});

 	console.log(`Logged in as ${client.user.tag}.`);
});

// Event handler for when a message is received
client.on('message', (message) => {
	// Ignore messages from bots
	if (message.author.bot) return;

	// Check if the message content is "Hi!"
	if (message.content === 'Hi!') {
		// Send a response to the same channel
		message.channel.send(`Hello, ${message.author.username}!`);
	}
});

// Log in the bot using the token
client.login(TOKEN);