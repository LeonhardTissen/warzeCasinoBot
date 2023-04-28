const commands = [];
exports.commands = commands;

function registerCommand(func, description, aliases, usage = "", adminOnly = false) {
    commands.push({func, aliases, description, usage, adminOnly});
}
exports.registerCommand = registerCommand;

// Load all command file from the "commands" directory
const { readdirSync } = require('fs');
const files = readdirSync('./commands');
files.map((f) => {
    require('./commands/' + f.substring(0, f.length - 3));
})