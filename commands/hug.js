module.exports = {
	name: 'hug',
	description: 'Tag a member to give them a big huggy.',
	guildOnly: true,
	modOnly: false,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user you want to hug!');
		}

		const taggedUser = message.mentions.users.first();
		message.channel.send(message.author.username +' gave a biiiig cosy hug to ' + taggedUser.username +'.');
	},
};
