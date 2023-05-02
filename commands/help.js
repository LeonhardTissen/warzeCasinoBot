const { commands, registerCommand } = require("../commands");
const { getPrefix } = require("../utils/getprefix");

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
    page = parseInt(page);
    if (!(page >= 1 && page <= 2)) {
        page = 1;
    }
    getPrefix(message.author.id).then((preferred_prefix) => {
        let helpmessage = `**Help: ${page}/2**\n` + generateCommandOverview(preferred_prefix, page - 1);
        message.channel.send(helpmessage)
    })
}
registerCommand(help, "Shows this message.", ['help', 'h'])