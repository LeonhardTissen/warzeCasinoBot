const { commands, registerCommand } = require("../commands");
const { PREFIX } = require("../utils/env");

function generateCommandOverview() {
    let commandoverview = "```ansi\n";
    commands.forEach((command) => {
        commandoverview += 
        (command.adminOnly ? "[0;41m" : "[0;40m") + 
        command.aliases.map(a => PREFIX + a).join(', ').padEnd(20, ' ') + 
        '[0;39m - ' + 
        command.description + '\n' +
        'Example: ' + PREFIX + command.aliases[0] + ' ' + command.usage + '\n\n';
    });
    commandoverview += "```";
    return commandoverview;
}

function help(message) {
    let helpmessage = "**Here's the help you requested:**\n" + generateCommandOverview();
    message.channel.send(helpmessage)
}
registerCommand(help, "Shows this message.", ['help', 'h'])