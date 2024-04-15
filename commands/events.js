module.exports = {
	name: 'events',
	description: 'Links info about events.',
	modOnly: false,
	aliases: 'event',
	execute(message) {
		message.channel.send('★ | every other week we have catalog events and every other week we have viewer visits!');
	},
};
