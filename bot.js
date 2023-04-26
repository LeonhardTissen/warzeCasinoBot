// Import the Discord.js library
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { C2Deck } = require('./casino2');
const { emojis } = require('./emojis');
const { send } = require('./general');
const sqlite3 = require('sqlite3').verbose();

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

// Connect to the SQLite database
const db = new sqlite3.Database('./currency.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the currency database.');
});
  
// Create the "users" table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	balance INTEGER DEFAULT 0
)
`);

const ongoing_games = {};

const PREFIX = '-';

// Event handler for when a message is received
client.on('messageCreate', (message) => {
	// Ignore messages from bots
	if (message.author.bot) return;

	let cmd;
	let num_cmd;
	if (message.content.startsWith(PREFIX)) {
		cmd = message.content.substring(1);
	} else {
		return;
	}
	num_cmd = parseInt(cmd);
  
	if (cmd.startsWith('balance') || cmd.startsWith('bal') || cmd.startsWith('b')) {
		// Get user's balance from the database
		db.get('SELECT balance FROM users WHERE id = ?', [message.author.id], (err, row) => {
			if (err) {
				console.error(err.message);
				return;
			}

			// Send the user's balance as a response
			const balance = row ? row.balance : 0;
	  
			// Send the embed message
			send(message, `<@${message.author.id}>'s Balance: **${balance} ${emojis.diamond}**`);
		});
		return;
	};

	if (cmd.startsWith('casino2test') || cmd.startsWith('c2t')) {
		const game = {
			type: 'casino2',
			state: {
				player1: new C2Deck()
			}
		}
		ongoing_games[message.author.id] = game;

		send(message, `You started a new game, here's your **Deck**:`)
		message.channel.send(game.state.player1.string())
	};

	if (num_cmd >= 1 && num_cmd <= 5) {
		const cgame = ongoing_games[message.author.id];
		if (cgame && cgame.type === 'casino2') {
			cgame.state.player1.toggleSingleCard(num_cmd - 1)

			message.channel.send(cgame.state.player1.string())
		}
	};
	
	// db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [message.author.id], (err) => {
	// db.run('UPDATE users SET balance = balance + 1 WHERE id = ?', [message.author.id], (err) => {
	// db.run('UPDATE users SET balance = balance - 1 WHERE id = ?', [message.author.id], (err) => {
});

// Log in the bot using the token
client.login(TOKEN);