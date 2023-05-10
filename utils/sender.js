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
	if (messageContents.length > 2000) {
		// Split message every 50th newline and send them individually
		splitMessages = messageContents.match(/(?=[\s\S])(?:.*\n?){1,50}/g);
		splitMessages.forEach((splitMessage) => {
			message.channel.send({
				embeds: [
					createEmbed(splitMessage)
				]
			});
		})
	} else {
		message.channel.send({
			embeds: [
				createEmbed(messageContents)
			]
		});
	}
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

// Sends a message to the channel with contents in an embed and a canvas as a fileupload
function sendBoth(message, messageContents, cvs) {
    message.channel.send({ 
		embeds: [
			createEmbed(messageContents)
		],
        files: [
            new AttachmentBuilder(cvs.toBuffer(), {name: 'image.png'})
        ] 
    });
}
exports.sendBoth = sendBoth;