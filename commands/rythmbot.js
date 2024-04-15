module.exports = {
	name: 'rythmbot',
	description: 'Gives info on how to use rythm bot commands',
	modOnly: false,
	aliases: ['play','leave'],
	execute(message) {
		message.channel.send('If you wanna use Rythm bot commands you have to either type `/` and then select the command you want or type `r!` in front of your command (for example `r!play`)');
	},
};
