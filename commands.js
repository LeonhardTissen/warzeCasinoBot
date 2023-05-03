const commands = [];
exports.commands = commands;

function registerCommand(func, description, aliases, usage = "", adminOnly = false, hiddenFromHelp = false) {
    commands.push({func, aliases, description, usage, adminOnly, hiddenFromHelp});
}
exports.registerCommand = registerCommand;

// Load all command file from the "commands" directory
const { readdirSync } = require('fs');
const files = readdirSync('./commands');
files.map((f) => {
    require('./commands/' + f);
})