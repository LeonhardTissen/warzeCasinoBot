const { registerCommand } = require("../commands");
const { createRowIfNotExists, db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
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
                    createRowIfNotExists(target, 'users');

                    db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                
                        // Send the user's balance as a response
                        const balance = row.balance;

                        send(message, `<@${target}>**'s Profile**:
**Inventory:**
- Diamonds: **${balance}** ${emojis.diamond}

**Casino 2 Statistics:**
- Wins: **${c2w}** :trophy:
- Losses: **${c2l}** :skull:
- Diamonds won: **${c2dw}** ${emojis.diamond}
- Diamonds lost: **-${c2dl}** ${emojis.diamond}

                        `);
                    });
                })
            })
        })
    })
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(profileCommand, "Shows your profile", ['profile', 'p'], "[@user?]", false, true);