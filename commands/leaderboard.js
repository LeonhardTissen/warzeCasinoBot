const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");

// The emojis that appear before the users
const leaderboard_emojis = [':first_place:',':second_place:',':third_place:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:']

function cmdLeaderboard(message) {
	// Get all users (up to 10) with a balance over 0 in descending order
	db.all('SELECT * FROM users WHERE balance > 0 ORDER BY balance DESC LIMIT 10 ', [], (err, results) => {
		if (err) {
			console.log(err.message);
			return;
		}

		// Format the leaderboard
		let lb_str = '';
		results.map((u, i) => {
			lb_str += `${leaderboard_emojis[i]} <@${u.id}> - **${u.balance}** ${emojis.diamond}\n`
		})
		send(message, lb_str);
	});
}

registerCommand(cmdLeaderboard, "Shows the balance leaderboard", ['leaderboard', 'lb'], "");