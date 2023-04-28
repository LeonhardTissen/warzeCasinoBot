const commands = [];
exports.commands = commands;

function registerCommand(func, description, aliases, usage = "", adminOnly = false) {
    commands.push({func, aliases, description, usage, adminOnly});
}
exports.registerCommand = registerCommand;