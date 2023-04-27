const { AttachmentBuilder } = require("discord.js");
const { createCanvas } = require('canvas');
const { registerCommand } = require("../commands");

function canvasTest(message) {
    const cvs = createCanvas(200, 200);
    const ctx = cvs.getContext('2d');

    // Set the fill style to red
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 200, 200)

    // Create a new MessageAttachment with the canvas as the file
    const attachment = new AttachmentBuilder(cvs.toBuffer(), {name: 'image.png'});
    message.channel.send({ files: [attachment] });
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs']);