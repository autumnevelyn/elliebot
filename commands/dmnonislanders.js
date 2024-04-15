module.exports = {
	name: 'dmnonislanders',
	description: 'Sends a dm to all non-islander members (to remind them to proprely join the server by grabbing the islander role) - only works on kandas island',
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		if (message.guild.id != '692341725825597480') {
			return;
        }
		let messageText = '';
		const guild = message.guild;
		const islanderRole = '695675462663405628'; // this is kinda ugly, i hate hardcoded id's
		let count = 0;

		//forms the message
        //args.shift();
		if (args.length == 0) {
			return message.reply('you gotta tell me what to say tho!');
        }
		args.forEach(element => {
			messageText += element;
			messageText += ' ';
		});

		//message.delete(); // yeet the command message

		try {
			let hasislander;
			guild.members.forEach(m => {
				if (!m.user.bot) {
					hasislander = false;
					//console.log(m.displayName);

					m.roles.forEach(role => {
						//console.log('\t' + role.id);

						if (role.id == islanderRole) {
							hasislander = true;
						}
					});
					if (!hasislander) {
						m.send(messageText);
						count++;
					}
				}
			});
			message.reply('i successfully sent a dm to ' + count + ' members.');
		} // send a dm to the desired user
		catch {message.reply('what the heck are you doing, this would never work.');}
	},
};
