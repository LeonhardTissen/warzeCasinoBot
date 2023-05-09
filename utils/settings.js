const { createRowIfNotExists, db } = require("./db")
const emojis = require('../emojis.json');
const settings = require('../settings.json');

const default_settings = [
    {
        name: "Reward Notifications",
        description: "Get pinged when your hourly, daily or weekly is ready to be collected.",
        id: "rn",
        type: "boolean",
        default: true
    },
    {
        name: "Marketplace Win Notifications",
        description: "Get pinged when you win an auction.",
        id: "mw",
        type: "boolean",
        default: true
    },
    {
        name: "Marketplace Outbid Notifications",
        description: "Get pinged when a bid on a marketplace item was outbid.",
        id: "mb",
        type: "boolean",
        default: true
    },
    {
        name: "Personal Prefix",
        description: "The prefix you use before commands.",
        id: "pp",
        type: "string",
        default: settings.prefix
    }
]
exports.default_settings = default_settings;

function parseSettingType(value, type) {
    if (type === "boolean") {
        return (value ? emojis.yes : emojis.no);
    } else if (type === "string") {
        return `**"${value}"**`;
    }
    return value;
}
exports.parseSettingType = parseSettingType;

function parseSettings(str) {
    // Get all the individual settings from the str
    const indiv = str.split(',').filter((s) => s != '');

    const parsed_settings = {};

    // Go through all available settings
    default_settings.forEach((default_setting) => {
        const s = default_setting;
        let found_setting = false;

        // See if the user settings has it
        indiv.forEach((indiv_setting) => {
            if (indiv_setting.startsWith(s.id)) {

                // Don't revert to default
                found_setting = true;

                // Remove the key from the setting
                indiv_setting = indiv_setting.replace(s.id, '');

                // Turn the string into another type
                if (s.type === "boolean") {
                    indiv_setting = (indiv_setting == 'true');
                } else if (s.type === "number") {
                    indiv_setting = parseInt(indiv_setting);
                }

                parsed_settings[s.id] = indiv_setting;
            }
        })

        // Revert to default
        if (!found_setting) {
            parsed_settings[s.id] = default_setting.default;
        }
    });

    return parsed_settings;
}

function getSettings(target) {
    return new Promise((resolve) => {
        createRowIfNotExists(target, 'settings')

        db.get('SELECT settings FROM settings WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            const parsed = parseSettings(row.settings);
            resolve(parsed);
        })
    })
}
exports.getSettings = getSettings;