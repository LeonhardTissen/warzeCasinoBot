const { registerCommand } = require("../commands");
const { db, createRowIfNotExists } = require("../utils/db");
const { send } = require("../utils/sender");

function sampleCommand(message, action = false) {
    createRowIfNotExists(message.author.id, 'rewardnotify');

    // Check if action passed in is valid
    if (![false, 'on', 'off'].includes(action)) {
        send(message, `Invalid action.`);
        return;
    }

    let setting_value;

    // Get previous value
    db.get('SELECT notify FROM rewardnotify WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        };

        // Determine new value
        if (action) {
            setting_value = (action === 'on' ? 1 : 0);
        } else {
            // Toggle previous value
            setting_value = !row.notify;
        }

        // Update settings
        db.run('UPDATE rewardnotify SET notify = ? WHERE id = ?', [setting_value, message.author.id], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            // Send a message
            send(message, `:bell: Reward notifications are now ${setting_value ? 'on' : 'off'} for you!`);
        })

    })
}

registerCommand(sampleCommand, "Toggle whether you want to get notifications", ['rewardnotify'], "[on|off?]");