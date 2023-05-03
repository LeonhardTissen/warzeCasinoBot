const { registerCommand } = require("../commands");
const { createRowIfNotExists } = require("../utils/db");
const { send } = require("../utils/sender");
const { getStat } = require("../utils/stats");

function profileCommand(message) {
	// This command does nothing except for return this message
    getStat('casino2lost', message.author.id).then((c2l) => {
        getStat('casino2won', message.author.id).then((c2w) => {
            getStat('casino2dlost', message.author.id).then((c2dl) => {
                getStat('casino2dwon', message.author.id).then((c2dw) => {
                    send(message, `(WIP) ${message.author.username}#${message.author.discriminator}
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
registerCommand(profileCommand, "Shows your profile", ['profile', 'p'], "", false, true);