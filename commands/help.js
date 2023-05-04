const { commands, registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const settings = require('../settings.json');
const { isNumeric } = require("../utils/numchoice");
const { send } = require("../utils/sender");

function help(message, argument) {
    // Filter out hidden commands
    let displayed_commands = commands.filter((c) => !c.hiddenFromHelp);

    // Filter out admin-only commands
    if (message.author.id !== settings.admin) {
        displayed_commands = displayed_commands.filter((c) => !c.adminOnly);
    }

    // Check if argument is the help of a specific command
    if (!isNumeric(argument) && argument) {
        displayed_commands = displayed_commands.filter((c) => c.aliases.includes(argument))
    }
    
    // Either no commands have been registered or they're all not applicable to the request
    if (displayed_commands.length === 0) {
        send(message, `No help available, sorry!`)
        return
    }

    // Amount of pages there are
    const page_amount = Math.ceil(displayed_commands.length / 10);

    // Clamp page index, passed in page num must be between 1 and page_amount, or default to 1
    const page = Math.min(Math.max(1, (isNumeric(argument) ? parseInt(argument) : 1)), page_amount);

    const pageOffset = (page - 1) * 10;
    getPrefix(message.author.id).then((preferred_prefix) => {
        let page_string = '';
        if (page_amount > 1) {
            page_string = `${page}/${page_amount}`;
        }

        // Top of the message
        let helpmessage = `**Help: ${page_string}**\n`

        // Start of the codeblock 
        helpmessage += "```ansi\n";

        // Render the text for every command
        for (let i = pageOffset; i < Math.min(displayed_commands.length, pageOffset + 10); i ++) {
            const command = displayed_commands[i];
            const desccolor = (command.adminOnly ? "[0;31m" : "[0;34m");
            const cmdcolor = (command.adminOnly ? "[0;41m" : "[0;40m");
            const aliases = command.aliases.map(a => preferred_prefix + a).join(', ').padEnd(30, ' ');
            helpmessage += 
            `${desccolor}- ${command.description}
${cmdcolor}${aliases}[0;39m
[0;30mExample: ${preferred_prefix}${command.aliases[0]} ${command.usage}\n\n`
        };

        // End of the codeblock
        helpmessage += "```";

        // Send the message
        message.channel.send(helpmessage)
    })
}
registerCommand(help, "Shows help about commands.", ['help', 'h'], "[page|cmd?]", false, false);