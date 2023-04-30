const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const settings = require('../settings.json');

// Creates a basic embed
function createEmbed(messageContents) {
	const embed = new EmbedBuilder()
		.setColor('#' + settings.color)
		.setDescription(messageContents)

	return embed;
};

// Send a message to the channel with contents in an embed
function send(message, messageContents) {
	message.channel.send({
		embeds: [
			createEmbed(messageContents)
		]
	});
}
exports.send = send;

// Sends a message to the channel with a canvas as a fileupload
function sendCvs(message, cvs) {
    message.channel.send({ 
        files: [
            new AttachmentBuilder(cvs.toBuffer(), {name: 'image.png'})
        ] 
    });
}
exports.sendCvs = sendCvs;