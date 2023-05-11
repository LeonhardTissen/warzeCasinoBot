const { AttachmentBuilder } = require("discord.js");
const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");
const emojis = require('../emojis.json');

function cmdSetupEmotes(message) {
	send(message, "Started... Copy the JSON from the terminal when it's done.");

    const emotenames = Object.keys(emojis)

    const newemotes = {};

    emotenames.forEach((emotename) => {
        // Upload emote
        const animated_prefix = (emotename == 'diamond' ? 'a' : '');
        const animated_file = (emotename == 'diamond' ? 'gif' : 'png');
        const attachment = new AttachmentBuilder(`./images/emotes/${emotename}.${animated_file}`, {name: emotename});
        message.guild.emojis.create(attachment).then((emoteobj) => {
            // Keep track of the emote id
            newemotes[emotename] = `<${animated_prefix}:${emoteobj.name}:${emoteobj.id}>`;

            // Check if all emotes are uploaded
            if (Object.keys(newemotes).length === emotenames.length) {
                console.log(JSON.stringify(newemotes, null, '    '))
            }
        })
    })
}

registerCommand(cmdSetupEmotes, "Set up all custom emotes", ['setupemotes', 'setupemojis'], "", true, false);