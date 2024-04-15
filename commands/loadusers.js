
module.exports = {
	name: 'loadusers',
	description: '(needs fixing) upload all already existing users of the guild to the db',
	adminOnly: true,
	aliases:'users',
	execute(message) {
		const db = require('../db');
		// find all the members
		message.guild.members.forEach(member => {
			console.log('<' + member.guild.id + '>: found ' + member.user.username + '<' + member.id + '>');
			db.query('INSERT INTO Member(id_member,guild,username,display_name) VALUES($1,$2,$3,$4)', [member.id, member.guild.id, member.user.username, member.displayName], (err,res) => {
				if (err) {
					return console.log(err.message);
				}else{
					console.log('<' + member.guild.id + '>: inserted ' + member.user.username + '<' + member.id + '>');
				}
			});
		});
		message.channel.send('Members were added to the database!');
		console.log('Members were added to the database!');
	},
};
