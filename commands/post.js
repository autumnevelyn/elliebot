module.exports = {
	name: 'post',
	description: 'Posts a message to the selected channel.',
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		const server = args[0];
		let messageText = '';
		args.forEach(element => {
			if(element != server) {
				messageText += element;
				messageText += ' ';
			}
		});
		let channel = message.guild.channels.find(c => c.name === server); // in case the channel was not tagged but only name was given
		if (channel == null) {
			channel = message.mentions.channels.first(); // in case the channel was tagged
		}

		message.delete();
		if(channel != null) {channel.send(messageText);}
		else {
			message.reply('channel ' + server + ' could not be found.');
		}
	},
};
