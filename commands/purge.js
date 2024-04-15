module.exports = {
	name: 'purge',
	description: 'deletes last 99 messages in the channel, but leaves out pinned ones',
	adminOnly: true,
	execute(message, args) {
		/*
		 * first we need to fetch the max deletable number of messages ie 99. the fetch function returns a promise, 
		 * if the promise is completed we can call bulkdelete on the message collection that is returned by fetch, 
		 * but in order to keep the pinned messages we apply a filer, verifying that only unpinned messages are passed to bulkdelete
		 */
		message.channel.messages.fetch({ limit: 99 }).then(messages =>
			message.channel.bulkDelete((messages.filter(m => !m.pinned)), true).catch(err => {
				console.error(err);
				message.channel.send('there was an error trying to prune messages in this channel!');
			})
		);

		const systemMessagesChannel = message.guild.channels.find(c => c.name === 'system_messages')
		systemMessagesChannel.send('<@' + message.author.id + '> purged the <#'+message.channel+'> channel')
	},
};
