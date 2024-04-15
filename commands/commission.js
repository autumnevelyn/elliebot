module.exports = {
	name: 'commission',
	description: 'Sends a link to kandas commission infopage!',
	modOnly: false,
	aliases: 'commissions',
	execute(message) {
		message.channel.send('★ | kanda\'s commission info: https://commissionkanda.carrd.co/');
	},
};