const { commands, registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");
const settings = require('../settings.json');

function generateCommandOverview(prefix, page) {
    const pageOffset = page * 10;
    let commandoverview = "```ansi\n";
    for (let i = pageOffset; i < Math.min(commands.length, pageOffset + 10); i ++) {
        const command = commands[i];
        const desccolor = (command.adminOnly ? "[0;31m" : "[0;34m");
        const cmdcolor = (command.adminOnly ? "[0;41m" : "[0;40m");
        const aliases = command.aliases.map(a => prefix + a).join(', ').padEnd(30, ' ');
        commandoverview += 
        `${desccolor}- ${command.description}
${cmdcolor}${aliases}[0;39m
[0;30mExample: ${prefix}${command.aliases[0]} ${command.usage}\n\n`
    };
    commandoverview += "```";
    return commandoverview;
}

function help(message, page) {
    let displayed_commands = commands.filter((c) => !c.hiddenFromHelp);

    // Remove admin-only commands
    if (message.author.id !== settings.admin) {
        displayed_commands = displayed_commands.filter((c) => !c.adminOnly);
    }

    // Amount of pages there are
    const page_amount = Math.ceil(displayed_commands.length / 10);

    page = parseInt(page);
    if (!(page >= 1 && page <= page_amount)) {
        // Default to page if not provided
        page = 1;
    }

    const pageOffset = (page - 1) * 10;
    getPrefix(message.author.id).then((preferred_prefix) => {

        // Top of the message
        let helpmessage = `**Help: ${page}/${page_amount}**\n`

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
registerCommand(help, "Shows this message.", ['help', 'h'])