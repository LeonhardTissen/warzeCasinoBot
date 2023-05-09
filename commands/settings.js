const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { getPrefix } = require("../utils/getprefix");
const { send } = require("../utils/sender");
const { getSettings, default_settings, parseSettingType } = require("../utils/settings");

function cmdSettings(message, settingid, newvalue) {
    getSettings(message.author.id).then((user_settings) => {
        getPrefix(message.author.id).then((prefix) => {
            // Store which setting was changed
            let marked_changed = null;

            // Change some values if provided
            if (settingid) {
                default_settings.forEach((default_setting) => {

                    // User argument matches setting
                    if (default_setting.id == settingid) {
                        marked_changed = settingid;

                        // Toggle the value if it's just a boolean
                        if (default_setting.type === "boolean") {
                            user_settings[settingid] = !user_settings[settingid];
                        } else if (default_setting.type === "string") {
                            if (!newvalue) {
                                send(message, `No value provided.`);
                                return
                            }

                            user_settings[settingid] = newvalue.substring(0, default_setting.maxstringlength);
                        }
                    }
                    
                })
            }

            // Send message displaying all the settings
            let settingsMsg = '**__Your Settings:__**\n\n';
            default_settings.forEach((setting) => {
                const m = (marked_changed == setting.id ? '> ' : '');

                settingsMsg += `${m}**${setting.name}** 
${m}${setting.description}
${m}${parseSettingType(user_settings[setting.id], setting.type)} \`${prefix}setting ${setting.id}\`\n\n`
            })
            send(message, settingsMsg);
        
            // Format new string to save into database
            let settings_str = '';
            for (const [key, value] of Object.entries(user_settings)) {
                settings_str += key + value + ',';
            }

            // Update database
            db.run(`UPDATE settings SET settings = ? WHERE id = ?`, [settings_str, message.author.id]);
        })
    })
}

registerCommand(cmdSettings, "Show and modify your personal settings", ['settings', 's'], "[settingid?] [newvalue?]", false, false);