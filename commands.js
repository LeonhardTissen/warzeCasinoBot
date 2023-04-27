const commands = [];
exports.commands = commands;

function registerCommand(func, description, aliases, adminOnly = false) {
    commands.push({func, aliases, description, adminOnly});
}
exports.registerCommand = registerCommand;