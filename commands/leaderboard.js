const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");

const leaderboard_emojis = [':first_place:',':second_place:',':third_place:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:']
function cmdLeaderboard(message) {
	db.all('SELECT * FROM users WHERE balance > 0 ORDER BY balance DESC', [], (err, results) => {
		if (err) {
			console.log(err.message);
			return;
		}
		let lb_str = '';
		for (let i = 0; i < Math.min(results.length, 10); i ++) {
			const user_row = results[i];
			lb_str += `${leaderboard_emojis[i]} <@${user_row.id}> - **${user_row.balance}** ${emojis.diamond}\n`
		}
		send(message, lb_str);
	});
}


registerCommand(cmdLeaderboard, "Shows the balance leaderboard", ['leaderboard', 'lb', 'kg'], "");