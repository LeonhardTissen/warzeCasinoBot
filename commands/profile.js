const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");
const { getStat } = require("../utils/stats");
const { parseUser } = require("../utils/usertarget");

function profileCommand(message, target) {
    // Set self as target if not provided
    target = parseUser(target, message.author.id);
    if (!target) {
        send(message, `Invalid target`);
        return;
    }

	// This command does nothing except for return this message
    getStat('casino2lost', target).then((c2l) => {
        getStat('casino2won', target).then((c2w) => {
            getStat('casino2dlost', target).then((c2dl) => {
                getStat('casino2dwon', target).then((c2dw) => {
                    send(message, `(WIP) <@${target}>
**Casino 2:**
- Wins: ${c2w}
- Losses: ${c2l}
- Diamonds won: ${c2dw}
- Diamonds lost: ${c2dl}

                    `);
                })
            })
        })
    })
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(profileCommand, "Shows your profile", ['profile', 'p'], "[@user?]", false, true);