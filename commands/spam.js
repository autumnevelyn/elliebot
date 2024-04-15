module.exports = {
	name: 'spam',
	description: 'for testing purposes, spams a 100 messages',
	adminOnly: true,
	execute(message) {
		for (let i = 0; i < 100; i++) {
			message.channel.send('this is the ' + i + 'th message');
		}
	},
};
