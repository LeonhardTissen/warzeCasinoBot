const { registerCommand } = require("../commands");
const { createRowIfNotExists, db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { getStats } = require("../utils/stats");
const { parseUser } = require("../utils/usertarget");

function profileCommand(message, target) {
    // Set self as target if not provided
    target = parseUser(target, message.author.id);
    if (!target) {
        send(message, `Invalid target`);
        return;
    }

	// This command does nothing except for return this message
    getStats(['casino2lost', 'casino2won', 'casino2dlost', 'casino2dwon', 'cflost', 'cfwon', 'cfdlost', 'cfdwon', 'connect4lost', 'connect4won', 'connect4dlost', 'connect4dwon', 'lotterywon', 'lotterytickets'], target).then((stats) => {
        createRowIfNotExists(target, 'users');
        createRowIfNotExists(target, 'redchest');

        db.get('SELECT balance FROM users WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            // Send the user's balance as a response
            const balance = row.balance;

            db.get('SELECT redchest FROM redchest WHERE id = ?', [target], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
        
                // Send the user's balance as a response
                const redchests = row.redchest;

                send(message, `<@${target}>**'s Profile**:
**Inventory:**
- Diamonds: **${balance}** ${emojis.diamond}
- Red Chests: **${redchests}** ${emojis.redchest}

**Casino 2 Statistics:**
- Wins: **${stats.casino2won}** :trophy:
- Losses: **${stats.casino2lost}** :skull:
- Diamonds won: **${stats.casino2dwon}** ${emojis.diamond}
- Diamonds lost: **${stats.casino2dlost}** ${emojis.diamond}

**Connect 4 Statistics:**
- Wins: **${stats.connect4won}** :trophy:
- Losses: **${stats.connect4lost}** :skull:
- Diamonds won: **${stats.connect4dwon}** ${emojis.diamond}
- Diamonds lost: **${stats.connect4dlost}** ${emojis.diamond}

**Coinflip Statistics:**
- Wins: **${stats.cfwon}** :trophy:
- Losses: **${stats.cflost}** :skull:
- Diamonds won: **${stats.cfdwon}** ${emojis.diamond}
- Diamonds lost: **${stats.cfdlost}** ${emojis.diamond}

**Lottery Statistics:**
- Wins: **${stats.lotterywon}** :trophy:
- Diamonds won: **${stats.lotterydwon}** ${emojis.diamond}
- Tickets bought: **${stats.lotterytickets}** ${emojis.ticket}

                `);
            })
        });
	})
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(profileCommand, "Shows your profile", ['profile', 'p'], "[@user?]", false, true);