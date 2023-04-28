const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

function createEmbed(messageContents) {
	const embed = new EmbedBuilder()
		.setColor('#5300F9')
		.setDescription(messageContents)

	return embed;
};

function send(message, messageContents) {
	message.channel.send({
		embeds: [
			createEmbed(messageContents)
		]
	});
}
exports.send = send;

function sendCvs(message, cvs) {
    message.channel.send({ 
        files: [
            new AttachmentBuilder(cvs.toBuffer(), {name: 'image.png'})
        ] 
    });
}
exports.sendCvs = sendCvs;