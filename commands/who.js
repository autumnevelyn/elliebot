module.exports = {
	name: 'who',
	description: 'Finds out who a user is. \n /who [name]',
	modOnly: true,
	guildOnly: true,
	aliases:['user', 'whois',' userinfo'],
	execute(message, args) {
		if(!args.length) {
			message.channel.send('Finds out who a user is. \n /who [name]');
		}
		let userFound = false;
		message.guild.fetch();
		const members = message.guild.members;
		members.forEach(member => {
			if(member.user.username.toLowerCase() === args[0].toLowerCase()) {
				userFound = true;
				return message.channel.send('Exact match found: <@' + member.user + '>');
			}
		});

		if(userFound === false) {
			members.forEach(member => {
				if(member.user.username.toLowerCase().includes(args[0].toLowerCase())) {
					userFound = true;
					return message.channel.send('Member found containing name: <@' + member.user + '>');
				}
			});
		}

		if(userFound === false) {
			return message.channel.send('No member could be found with this name.');
		}
	},
};
