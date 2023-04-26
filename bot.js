// Import the Discord.js library
const { EmbedBuilder, AttachmentBuilder, Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
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

function createEmbed(messageContents) {
	const embed = new EmbedBuilder()
		.setColor('#5000F6')
		.setDescription(messageContents)

	return embed;
};

function send(message, messageContents) {
	message.channel.send({
		embeds: [
			createEmbed(messageContents)
		]
	});
}

const emojis = {
	diamond: '<a:diamond:1100814792769409185>',
	cardopen: '<:cardopen:1100811766193205249>',
	cardclosed: '<:cardclosed:1100811765396295781>',
	card1: '<:card1:1100811753627070604>',
	card2: '<:card2:1100811754830827531>',
	card3: '<:card3:1100811757531971595>',
	card4: '<:card4:1100811760346345583>',
	card5: '<:card5:1100811762179260536>',
	card6: '<:card6:1100811764238647387>',
	geize: '<:geize:1100812718673498152>',
	geizeangry: '<:geizeangry:1100812715695538338>',
	geizesleep: '<:geizesleep:1100812713074110495>',
	geizehappy: '<:geizehappy:1100812717079666798>'
}

function randRange(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min)
}

function randCard() {
	return emojis['card' + randRange(1,6)]
}

class C2Card {
	constructor() {
		this.face = randCard();
		this.shown = true;
	}
	string() {
		return (this.shown ? this.face : emojis.cardclosed);
	}
	toggle() {
		this.shown = !this.shown;
	}
}

class C2Deck {
	constructor() {
		this.cards = [
			new C2Card(),
			new C2Card(),
			new C2Card(),
			new C2Card(),
			new C2Card()
		]
	}
	string() {
		let final = '';
		this.cards.forEach((card) => {
			final += card.string();
		});
		return final;
	}
	toggleSingleCard(id) {
		this.cards[id].toggle();
	}
}

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
  
	// Check if the message content is a valid command
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
	}

	if (num_cmd >= 1 && num_cmd <= 5) {
		const cgame = ongoing_games[message.author.id];
		if (cgame) {
			cgame.state.player1.toggleSingleCard(num_cmd - 1)

			message.channel.send(cgame.state.player1.string())
		}
	}
	
	// } else if (cmd.startsWith('earn')) {
	// 	// // Add coins to user's balance
	// 	// db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [message.author.id], (err) => {
	// 	// 	if (err) {
	// 	// 		console.error(err.message);
	// 	// 		return;
	// 	// 	}
	
	// 	// 	db.run('UPDATE users SET balance = balance + 1 WHERE id = ?', [message.author.id], (err) => {
	// 	// 	if (err) {
	// 	// 		console.error(err.message);
	// 	// 		return;
	// 	// 	}
	
	// 	// 	// Send a response indicating that coins were earned
	// 	// 	message.channel.send(`${message.author.username}, you earned 1 coin.`);
	// 	// 	});
	// 	// });
	// } else if (cmd.startsWith('spend')) {
	// 	// // Deduct coins from user's balance
	// 	// db.run('UPDATE users SET balance = balance - 1 WHERE id = ?', [message.author.id], (err) => {
	// 	// 	if (err) {
	// 	// 		console.error(err.message);
	// 	// 		return;
	// 	// 	}
	
	// 	// 	// Send a response indicating that coins were spent
	// 	// 	message.channel.send(`${message.author.username}, you spent 1 coin.`);
	// 	// });
	// }
});

// Log in the bot using the token
client.login(TOKEN);