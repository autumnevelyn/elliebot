module.exports = {
	name: 'beep',
	description: 'Beep!',
	modOnly: false,
	aliases:['beepbeepmotherfucker','beepo','boop'],
	execute(message) {
		const r = Math.floor(Math.random() * 100);
		if(r == 1) {
			return message.channel.send('NO U');
		}
		else if(r == 2) {
			return message.channel.send('I will beep for treats!');
		}
		else if(r == 3) {
			return message.channel.send('<:kandaLoaf:741178733993656362>');
		}
		if(message.content.split('!')[1] == 'boop') {
			return message.channel.send('Beep.');
		}
		message.channel.send('Boop.');
	},
};
