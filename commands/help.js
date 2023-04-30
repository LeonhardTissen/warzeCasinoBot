const { commands, registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");

function generateCommandOverview(prefix) {
    let commandoverview = "```ansi\n";
    commands.forEach((command) => {
        commandoverview += 
        (command.adminOnly ? "[0;41m" : "[0;40m") + 
        command.aliases.map(a => prefix + a).join(', ').padEnd(20, ' ') + 
        '[0;39m - ' + 
        command.description + '\n' +
        'Example: ' + prefix + command.aliases[0] + ' ' + command.usage + '\n\n';
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