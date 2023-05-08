const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const emojis = require('../emojis.json');
const { send } = require("../utils/sender");
const { secToReadable } = require("../utils/timestr");
const { changeChests } = require("../utils/chests");
const { getSecUntilReward } = require("../utils/timereward");
const { parseUser } = require("../utils/usertarget");

function weekly(message, target) {
    // Check if the target user is valid
	target = parseUser(target, message.author.id);
	if (!target) {
		send(message, `Invalid target.`);
		return;
	}
    if (target == message.author.id) {
        send(message, `You can't redeem the weekly on yourself.`);
        return;
    }

    getSecUntilReward(target, 'weeklies', 604800).then((secTillWeekly) => {
        // Prevent the user from collecting their weekly
        if (secTillWeekly > 0) {
            send(message, `<@${message.author.id}>, you need to wait **${secToReadable(secTillWeekly)}**.`);
            return
        }
            
        // Give the target a golden chest
        send(message, `<@${message.author.id}>, you gifted <@${target}> **Golden Chest** ${emojis.goldenchest}`);
        changeChests(target, 1, 'golden')
        
        // Apply a timer that the user has to wait before collecting the next daily
        const now = Math.floor(Date.now() / 1000);
        db.run('UPDATE weeklies SET last = ? WHERE id = ?', [now, message.author.id], (err) => {
            if (err) {
                console.log(err.message);
            }
        })
    })
}
registerCommand(weekly, "Gift someone a golden chest every week", ['weekly', 'we'], "[@user]", false, false);