module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	modOnly: true,
	execute(message) {
		message.channel.send('Pong.');
	},
};
