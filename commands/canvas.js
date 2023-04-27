const { AttachmentBuilder } = require("discord.js");
const { createCanvas } = require('canvas');
const { registerCommand } = require("../commands");

function canvasTest(message) {
    // Create a canvas with a width and height of 200 pixels
    const canvas = createCanvas(200, 200);

    // Get the canvas context
    const context = canvas.getContext('2d');

    // Set the fill style to red
    context.fillStyle = 'red';

    // Fill a rectangle with the red color
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create a new MessageAttachment with the canvas as the file
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'image.png'});

    // Respond with the attachment
    message.channel.send({ files: [attachment] });
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs']);