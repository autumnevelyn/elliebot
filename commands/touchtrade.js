module.exports = {
	name: 'touchtrade',
	description: 'Explains the term touchtrade.',
	modOnly: false,
	aliases: 'touchtrad',
	execute(message) {
		message.channel.send('★ | touch trade is when a player drops an item, so another player can pick it up to add it to their catalog. that player then gives back the item to the first player, but can order their own item through nook shopping.');
	},
};
