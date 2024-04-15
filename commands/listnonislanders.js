module.exports = {
	name: 'listnonislanders',
	description: 'lists all non-islander members - only works on kandas island',
	guildOnly: true,
	modOnly: true,
	execute(message) {

		//let messageText = '';
		//const islanderRole = '695675462663405628'; // this is kinda ugly, i hate hardcoded id's, but cba
		//let count = 0;

		let hasislander;
		const Role = message.guild.roles.find(role => role.name == 'islanders 🍃');
		const Members = message.guild.members.filter(member => {
			hasislander = false;
			member.roles.forEach(role => {
				console.log("pls");
				if (role == Role) {
					hasislander = true;
				}
			});
			return true;//!hasislander;

		}).map(member => member.user.username);
		message.channel.send(`Users without ${Role.name}: ${Members}`);
		//guild.members.forEach(m => {
		//	if (!m.user.bot) {
		//		hasislander = false;
		//		//console.log(m.displayName);

		//		m.roles.forEach(r => {
		//			//console.log('\t' + role.id);

		//			if (r === Role) {
		//				hasislander = true;
		//			}
		//		});

		//		if (!hasislander) {
		//			messageText+='<@'+m.id+'> :  ' + m.joinedAt+'\n';
		//			count++;
		//		}
		//	}
		//});
		//message.channel.send('**these are all the members without islander role and the time they joined the server:**\n' + messageText);
	},
};
