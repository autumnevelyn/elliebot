module.exports = {
	name: 'dm',
	description: 'Sends a dm to a tagged user. Use to troll mods',
	guildOnly: false,
	modOnly: true,
	execute(message, args) {
		const server = args[0];
		let messageText = '';

		//forms the message
        args.shift();
		args.forEach(element => {
			if(element != server) {
				messageText += element;
				messageText += ' ';
			}
		});

		message.delete(); // yeet the command message
		try {
			let user = message.guild.members.find(m => m.displayName === server); // in case the member was not tagged but only name was given
			if (user == null) {
				user = message.mentions.users.first(); //in case the member is tagged
			}
			user.send(messageText) // send a dm to the desired user
		}
		catch {message.reply('what the heck are you doing, this would never work.');}
	},
};
