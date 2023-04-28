const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");

function sampleCommand(message) {
	// This command does nothing except for return this message
	send(message, 'This is a sample command')
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(sampleCommand, "Sample command", ['sample', 'smpl'], "");