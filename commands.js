const commands = [];
exports.commands = commands;

function registerCommand(func, description, aliases) {
    commands.push({func, aliases, description});
}
exports.registerCommand = registerCommand;