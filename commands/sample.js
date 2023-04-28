const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");

function sampleCommand(message) {
	send(message, 'This is a sample command')
}
registerCommand(sampleCommand, "Sample command", ['sample', 'smpl'], "");