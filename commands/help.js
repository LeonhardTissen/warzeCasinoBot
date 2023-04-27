const { commands, registerCommand } = require("../commands");

function help(message) {
    let helpmessage = "**Here's the help you requested:**\n";
    helpmessage += "```";
    commands.forEach((command) => {
        helpmessage += command.aliases.join(', ').padEnd(20, ' ') + ' - ' + command.description + '\n';
    });
    helpmessage += "```";
    message.channel.send(helpmessage)
}
registerCommand(help, "Shows this message.", ['help', 'h'])