const { EmbedBuilder } = require("discord.js");

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

function randRange(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min)
}
exports.randRange = randRange;