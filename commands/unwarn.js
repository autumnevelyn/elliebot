module.exports = {
	name: 'unwarn',
	description: 'deletes a warning or warnings that has been given out',
	usage:'@user warning_id', // !unwarn @user all??
    modOnly: true,
    guildOnly: true,
	aliases:['deletewarning', 'deletewarnings'],
	execute(message, args) {
        const db = require('../db');

		const system_messages = message.guild.channels.find(c => c.name === 'system_messages');

		try { // check if a user was tagged
			let warningTargetId = message.mentions.users.first().id;
		}
		catch (error) {
			console.error(error.message);
			return message.reply('It seems like you have not tagged a user propperly, please try again.');
		}
	
		args.shift(); // remove user tag from args
		if (args.length == 0){ //check if id was provided
			return message.reply('You have to provide the id of the warning/s that you want to delete.\n Try running the *!warnings @user* command to get info on all the existing warnings a user has recieved.');
		}

		args.forEach(id => { // try to remove each id in the list
			db.query('DELETE FROM Warning WHERE id_warning = $1 AND target = $2',[id, message.mentions.users.first().id], (err,res) => {
				if (err) {
					return console.log(err.message);
				}
				if(res.rowCount == 1) {
					console.log('a row in the Warning table has been deleted');
					message.channel.send('Warning with the id **'+id+ '** was deleted from the record of <@'+ message.mentions.users.first().id+'>');
				}else{
					message.channel.send('I could not find a warning with the id **'+id+ '** in the record of <@'+ message.mentions.users.first().id+'>');
				}
			});
		});
	},
};