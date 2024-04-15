module.exports = {
	name: 'warn',
	description: 'give out a warning to a user',
	usage:'!warn @user warning reason',
	modOnly: true,
	guildOnly: true,
	aliases:['warnuser', 'warning'],
	execute(message, args) {
		const db = require('../db');

		let warningType = 1; // different warning types not implemented -> all set to 1/mild for now
		let warningReason = 'misbehaviour'; // default warning reason if none is provided
		let warningTargetId;
		const system_messages = message.guild.channels.find(c => c.name === 'system_messages');

		try {
			warningTargetId = message.mentions.users.first().id;
		}
		catch (error) {
			console.error(error.message);
			return message.reply('It seems like you have not tagged a user propperly, please try again.');
		}
        
		args.shift(); // remove user tag from args
		if (args.length > 0) {
			warningReason = '';
			args.forEach(word => {
				warningReason += word + ' ';
			});
			warningReason = warningReason.slice(0, -1);
		}
			
		db.query('INSERT INTO Warning(type, reason, target, author, guild, channel)  VALUES ($1, $2, $3, $4, $5, $6)',[warningType, warningReason, warningTargetId, message.author.id, message.guild.id, message.channel.id], function(err,res) {
			if (err) {
				return console.log(err.message);
			}
			message.channel.send('A warning was given out.')
			// redirect message to syste_messages
			system_messages.send('<@&698514542753480784> <@'+message.author.id +'> gave out a warning to <@'+ message.mentions.users.first()+'> \n\treason: '+ warningReason+'\n\tchannel: <#'+ message.channel.id+'>');	
			console.log('warning inserted');
		});
	},
};