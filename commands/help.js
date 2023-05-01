const { commands, registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");

function generateCommandOverview(prefix) {
    let commandoverview = "```ansi\n";
    commands.forEach((command) => {
        const desccolor = (command.adminOnly ? "[0;31m" : "[0;34m")
        const cmdcolor = (command.adminOnly ? "[0;41m" : "[0;40m")
        const aliases = command.aliases.map(a => prefix + a).join(', ').padEnd(20, ' ');
        commandoverview += 
        `${desccolor}- ${command.description}
${cmdcolor}${aliases}[0;39m
[0;30mExample: ${prefix}${command.aliases[0]} ${command.usage}\n\n`
    });
    commandoverview += "```";
    return commandoverview;
}

function help(message) {
    getPrefix(message.author.id).then((preferred_prefix) => {
        let helpmessage = "**Here's the help you requested:**\n" + generateCommandOverview(preferred_prefix);
        message.channel.send(helpmessage)
    })
}
registerCommand(help, "Shows this message.", ['help', 'h'])