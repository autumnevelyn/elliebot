module.exports = {
	name: 'warnings',
    description: 'lists all the warnings the specified user has recieved',
    usage:'!warnings @user', 
    modOnly: true,
    guildOnly: true,
	aliases:['listwarnings','countwarnings'],
	execute(message) {
        const db = require('../db');
        
        let warningTargetId;
        let data = [];

        try {
            warningTargetId = message.mentions.users.first().id;
        }
        catch (error) {
            console.error(error.message);
            return message.reply('It seems like you have not tagged a user propperly, please try again.');
        }
        
        db.query('SELECT * FROM Warning WHERE target = $1',[message.mentions.users.first().id],(err, res ) => {
            if (err) {
                throw err;
            }
            let rows = res.rows;
            rows.forEach((row) => {
                if(row.guild == message.guild.id){ //&& row.delete_date_time==null
                    data.push('\t**[id: '+row.id_warning +'] '+row.date_time + '** from <@'+ row.author +'> for *' + row.reason + '* in <#' + row.channel + '>\n');
                }
            });

            let warningCount = data.length;
            if(warningCount == 0){
                data.unshift(`${message.mentions.users.first()} has no warnings.`);
            }else if(warningCount == 1){
                data.unshift(`${message.mentions.users.first()} has only recieved one warning: \n`);
            }else{
                data.unshift(`${message.mentions.users.first()} has recieved ${warningCount} warnings: \n`);
            }

            // only send the list of warnings in mod_chat or elliebot_test, else DM
            if(message.channel.id == '723139839914147904' || message.channel.id == '698515255407673367' || message.channel.id == '755727522921971794'){
                message.channel.send(data);
            }else{
                message.author.send(data);
                message.channel.send(`${message.author}, I've sent you a DM with details about warnings ${message.mentions.users.first()} has recieved.`)
            }

        });


	},
};