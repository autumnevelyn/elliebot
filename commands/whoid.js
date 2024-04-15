module.exports = {
	name: 'whoid',
	description: 'Finds out who a user is through id.\n /who [id]',
	modOnly: true,
	guildOnly: true,
	aliases:'userid',
	execute(message, args) {
		if(!args.length) {
			message.channel.send('Finds out who a user is through id.\n /who [id]');
		}
		else {
			return message.channel.send('member: <@' + args[0] + '>');
		}
	},
};
