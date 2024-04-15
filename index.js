/* eslint-disable indent */
/* eslint-disable prefer-const */
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const { Console } = require('console');
//const sqlite3 = require('sqlite3').verbose();
const db = require('./db');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.config = new Discord.Collection();
client.config.token = config.token;
client.config.admin = config.admin;
client.config.prefix = config.prefix;
client.config.mod = config.mod;
client.config.set(0, config);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// const currencyFiles = fs.readdirSync('./currency').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();



// ## GLOBAL FUNCTIONS ##

// Bad word filters
// for regexp tester:  ([bB6]+[aA4]+[lL1!]+[\s]*[sS5$]+[aA4]+[cK]+[kK]+)|([bB6]+[lL1!]+[oO0]+[wW]+[\s]*[jJ]+[oO0]+[bB6]+)|(\b[aA4]+[nN]+[aA4]+[lL]+[yY]*\b)|(\b[aA4]+[nN]+[uU4]+[sS$5]+)|([vV]+[aA4]+[gG65]+[iIl!1]+[nN]+[aA4]+)|(\b[nN]+[uU4]+[dD]+[eE3]+[sS$5]+\b)|([pP]+[eE3]+[nN]+[iIl!1]+[sS5$]+)|([wW]+[hH#]+[oO0]+[rR]+([eE3]+[sS5$]*|[iI!1]+[nN]+[gG65]+))|(\b[tT7]+[hH#]+[oO0]+[tT7]+[sS5$]*\b)|([sS5$]+[mM]+[eE3]+[gG65]+[mM]+[aA4]+)|([sS5$]+[lL1!]+[uU4]+[tT7]+)|(\b[rR]+[aA4]+[pP]+([eE3]+[rR]*|[iI!1l]+[sS5$]+[tT7]+)[sS5$]*\b)|(\b[kK]+[mMyY]+[sS5$]+\b)|([jJ]+[iI1l]+[zZ]+)|([kK]+[iIl!1]+[lL1!I]+.*[sS5$]+[eE3]+[lLI1!]+[fF]+)|([bB6]+[uU4]+[tT7]+[pP]+[lL1!]+[uU4]+[gG65]+)|([cC]+[lL1!]+[iIl!]+[tT7]+([oO0]+[rR]+[iIl!]+[sS5$]+|\b))|(\b[cC]+[uU4]+[mM]+([iIl1!]+[nN]+[gG65]+|[sS5$]+)*\b)|([cC]+[uU4]+[nN]+[tT7]+)|([cC]+[oO0]+[cC]+[kK]+)|([dD]+[iIl1!]+[cC]+[kK]+)|([dD]+[iIl1!]+[lL1!]+[dD]+[oO0]+)|([pP]+[uU4]+[sS5$]+[yY]+)
function hasWarnWord(string){
	return (
		new RegExp(/[bB6]+[aA4]+[lL1!]+[\s]*[sS5$]+[aA4]+[cK]+[kK]+/).test(string) || 
		new RegExp(/[bB6]+[lL1!]+[oO0]+[wW]+[\s]*[jJ]+[oO0]+[bB6]+/).test(string) ||
		new RegExp(/\b[aA4]+[nN]+[aA4]+[lL]+[yY]*\b/).test(string) ||
		new RegExp(/\b[aA4]+[nN]+[uU4]+[sS$5]+/).test(string) ||
		new RegExp(/[vV]+[aA4]+[gG65]+[iIl!1]+[nN]+[aA4]+/).test(string) ||
		new RegExp(/\b[nN]+[uU4]+[dD]+[eE3]+[sS$5]+\b/).test(string) ||
		new RegExp(/[pP]+[eE3]+[nN]+[iIl!1]+[sS5$]+/).test(string) ||
		new RegExp(/[wW]+[hH#]+[oO0]+[rR]+([eE3]+[sS5$]*|[iI!1]+[nN]+[gG65]+)/).test(string) ||
		new RegExp(/\b[tT7]+[hH#]+[oO0]+[tT7]+[sS5$]*\b/).test(string) ||
		new RegExp(/[sS5$]+[mM]+[eE3]+[gG65]+[mM]+[aA4]+/).test(string) ||
		new RegExp(/[sS5$]+[lL1!]+[uU4]+[tT7]+/).test(string) ||
		new RegExp(/\b[rR]+[aA4]+[pP]+([eE3]+[rR]*|[iI!1l]+[sS5$]+[tT7]+)[sS5$]*\b/).test(string) ||
		new RegExp(/\b[kK]+[mMyY]+[sS5$]+\b/).test(string) ||
		new RegExp(/[jJ]+[iI1l]+[zZ]+/).test(string) ||
		new RegExp(/[kK]+[iIl!1]+[lL1!I]+.*[sS5$]+[eE3]+[lLI1!]+[fF]+/).test(string) ||
		new RegExp(/[bB6]+[uU4]+[tT7]+[pP]+[lL1!]+[uU4]+[gG65]+/).test(string) ||
		new RegExp(/[cC]+[lL1!]+[iIl!]+[tT7]+([oO0]+[rR]+[iIl!]+[sS5$]+|\b)/).test(string) ||
		new RegExp(/\b[cC]+[uU4]+[mM]+([iIl1!]+[nN]+[gG65]+|[sS5$]+)*\b/).test(string) ||
		new RegExp(/[cC]+[uU4]+[nN]+[tT7]+/).test(string) ||
		new RegExp(/[cC]+[oO0]+[cC]+[kK]+/).test(string) ||
		new RegExp(/[dD]+[iIl1!]+[cC]+[kK]+/).test(string)||
		new RegExp(/[dD]+[iIl1!]+[lL1!]+[dD]+[oO0]+/).test(string)||
		new RegExp(/[pP]+[uU4]+[sS5$]+[yY]+/).test(string)

	);
}
function hasBanWord(string){
	return (
		new RegExp(/[fF]+[aA4]+[gG65]+(\b|[sS5$]+|[oO0]+[tT7]+)/).test(string) ||
		new RegExp(/[nN]+[eE3]+[gG3bB]+[rR]+[oO0]+/).test(string) ||
		new RegExp(/[nN]+[iI1!]+([gG3bB]{2,}([aA4]+|[eE3]+[rR])|[gG3bB]+[uU4]+[rR]+)/).test(string)
	);
}
function hasSuicideWord(string) {
	return (
		new RegExp(/[sS]+[uU]+[iI]+[cC]+[iI]+[dD]+[eE]/).test(string) ||
		new RegExp(/[kK]+[iIl!1]+[lL1!I]+.*[mM]+[yY]+[sS5$]+[eE3]+[lLI1!]+[fF]+/).test(string)
	);
}

function verifyNickname(member){
	let passed = true;
	if (!module.exports.Admin(member.id) && !module.exports.Mod(member.id)) {
		// Bannable nicknames - resulting in a ban and warning to the mods
		// if(hasBanWord(member.displayName)) {
		// 	passed = false;
		// 	const channel = member.guild.channels.find(c => c.name === 'system_messages');
		// 	channel.send('<@&698514542753480784> <@' + member.id + '> has been banned for having an offensive term in their server nickname: "' + member.displayName+'"');
		// 		member.user.send('You\'ve been banned for having an offensive term in your server nickname: "' + member.displayName+'"');
		// 		// Added timer so bot has time to send PM before ban.
		// 		setTimeout(function() {
		// 			member.ban({ days: 0, reason: 'Has the following offensive nickname: "' + member.displayName+'"' });
		// 		}, 1000);
		// }

		// Bad nicknames - those produce only a warning to the mods
		if(hasWarnWord(member.displayName) || hasBanWord(member.displayName)) {
			const channel = member.guild.channels.find(c => c.name === 'system_messages');
			channel.send('<@&698514542753480784> <@' + member.id + '> has a bad word in their nickname: "' + member.displayName+'"');
		}
	}
	return passed;
}

// ## VENT CHANNEL AUTO-MESSAGE ##\

let ventTimer; // couldnt figure out how to make the vent channel timer not global 
let oldReminder;
let ventChannelEmbed = new Discord.MessageEmbed();
ventChannelEmbed.setColor('#FB6B90');
ventChannelEmbed.setTitle('Welcome to the vent channel. Be sure to check our pinned messages and read the rules before using the channel.\nThank you for helping us keep this a safe and cozy environment. <3 ');

function ventChannelAutoMessage(msg) {
	clearTimeout(ventTimer);
	ventTimer = setTimeout(() => {
		if (oldReminder) { oldReminder.delete(); }
		msg.channel.send(ventChannelEmbed).then(m => {
			oldReminder = m;
			//console.log(oldReminder);
		 });
	}, 900000); // timer set to 15 mins
}


// ## EVENT LISTENERS ##

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const vipRoleId = '887603813865906186'
	const modRoleId = '698514542753480784'
	let isMemberVip = false
	let isMemberMod = false
	// Filter (the regexp has been moved down to exported functions)
	if (message.author.bot) return;

	if (message.channel.type == "dm") {
		let channel = client.channels.find(c => c.id === '698518738009456640');
		if (channel == null) {
			channel = client.channels.find(c => c.id === '727715826269945896');
		}
		channel.send('**<@'+message.author.id+'> sent the following dm to me: ** *' + message.cleanContent + '*');
	}

	if(message.member)
	{
		isMemberVip = message.member.roles.map(role => role.id).includes(vipRoleId)
		isMemberMod = message.member.roles.map(role => role.id).includes(modRoleId)
	}

	
	if (!module.exports.Admin(message.author.id) && !isMemberMod && !isMemberVip ) {
		// old way of checking for mod: !module.exports.Mod(message.author.id)

		// //Ban section 
		// if(hasBanWord(message.content)) {
		// 	message.delete();
		// 	const channel = message.guild.channels.find(c => c.name === 'system_messages');
		// 	channel.send('<@' + message.author.id + '> sent following: "' + message.content + '" in <#' + message.channel.id + '>');
		// 		message.author.send('You\'ve been banned for the following message: ' + message.content);
		// 		// Added timer so bot has time to send PM before ban.
		// 		setTimeout(function() {
		// 			message.guild.member(message.author).ban({ days: 0, reason: 'Used word: ' + message.content });
		// 			}, 1000);
		// }

		// Warning section
		if (hasWarnWord(message.content) || hasBanWord(message.content)) {
			const channel = message.guild.channels.find(c => c.name === 'system_messages');
			channel.send('<@&698514542753480784> <@' + message.author.id + '> sent following: "' + message.content + '" in <#' + message.channel.id + '>');
			//message.author.send('You\'ve been warned for using a bad word.');
		}

	}
	// End filter section

	// check if message was sent in vent channel (or elliebot test channel)
	if (message.channel.id == '858818388130660382' || message.channel.id == '723139839914147904') {
		try {
			ventChannelAutoMessage(message);
		} catch (error) {
			console.error(error);
		}
	}

	// Return if message does not contain prefix or is from a bot
	if (!message.content.toLowerCase().startsWith(client.config.prefix) || message.author.bot) return;

	// Slice the message to get every argument
	const args = message.content.slice(client.config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Get the command name
	let command;
	client.commands.forEach(element => {
		if(commandName == element.name){command = element}
		else if(command == null && element.aliases != "" && element.aliases != undefined)
		{
			element.aliases.toString().split(",").forEach(e => 
			{
				if(e == commandName){
					command = element;
				}
			})
		}
	})

	// If no command could be found, return
	if (!command) return;

	// Check if we are inside a guild for guildOnly messages
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	// Check if command is for admin only
	if(command.adminOnly) {
		let admin = module.exports.Admin(message.author.id);
		if(!admin) {
			message.reply('You do not have access to this command.');
			return;
		}
	}
	// Check if command is for mod only
	if(command.modOnly) {
		let mod = module.exports.Mod(message.author.id);
		if(!mod) {
			message.reply('You do not have access to this command.');
			return;
		}
	}

	// Check if command requires args but none was provided
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Set cooldown for commands
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	// Set cooldown timers for users. Fix this so it uses the new function for mod check.
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 5) * 1000;
	const modSplit = client.config.mod.split(',');
	let modUser = false;
	modSplit.forEach(element => {
		if(element.includes(message.author.id)) {modUser = true;}
	});
	if(modUser == false) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Execute the command.
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('guildMemberAdd', member => {
	// insert the new member in the db
	db.query('INSERT INTO Member(id_member,guild,username,display_name) VALUES($1,$2,$3,$4)', [member.id, member.guild.id, member.user.username, member.displayName], (err,res) => {
		if (err) {
			return console.log(err.message);
		}
		console.log('<' + member.guild.id + '>: inserted ' + member.user.username + '<' + member.id+'>');
	});

	// apply bad word filter on the nickname of the new user
	verifyNickname(member);
});

client.on('messageDelete', message=>{
	if (message.mentions.users.size > 0 || message.mentions.members.size > 0) {
		if (message.channel.id === '733006615325966517' || message.channel.id === '733006780208119894' || message.author.bot) return;
		let channel = message.guild.channels.find(ch => ch.id === '733006615325966517');
		if(channel == null) {
			channel = message.guild.channels.find(ch => ch.id === '733006780208119894');
		}
		const exampleEmbed = new Discord.MessageEmbed();
		const channelName = message.channel.name;
		exampleEmbed.setTitle('Message deleted \nGhost ping');
		exampleEmbed.setColor('#ffa6a2');
		exampleEmbed.addField('Author: ', message.author.tag);
		exampleEmbed.addField('Author ID: ', message.author.id);
		// exampleEmbed.addField('Original message: ', message.cleanContent);
		// the field value cannot exceed 1024 characters, so the following fix loops over the original message and devides the content into multiple fields 
		for (let i = 0; i < message.cleanContent.length; i += 1024) {
			const cont = message.cleanContent.substring(i, Math.min(message.cleanContent.length, i + 1024));
			exampleEmbed.addField('Original message [' + ((i / 1024)+1) + ']: ', cont);
		}
		exampleEmbed.addField('Channel: ', channelName);
		exampleEmbed.setTimestamp(message.createdTimestamp);
		channel.send(exampleEmbed);
		if(!channel) return;
	}
	else {
		if (message.channel.id === '733006615325966517' || message.channel.id === '733006780208119894' || message.author.bot) return;
		let channel = message.guild.channels.find(ch => ch.id === '733006615325966517');
		if(channel == null) {
			channel = message.guild.channels.find(ch => ch.id === '733006780208119894');
		}
		const exampleEmbed = new Discord.MessageEmbed();
		const channelName = message.channel.name;
		exampleEmbed.setTitle('Message deleted');
		exampleEmbed.setColor('#ffa6a2');
		exampleEmbed.addField('Author: ', message.author.tag);
		exampleEmbed.addField('Author ID: ', message.author.id);
		if(message.cleanContent.length>0) { // BUGFIX: deleting a message with a nontext content would result into an empty string and crash the bot
			// exampleEmbed.addField('Original message: ', message.cleanContent);
			// the field value cannot exceed 1024 characters, so the following fix loops over the original message and devides the content into multiple fields 
			for (let i = 0; i < message.cleanContent.length; i += 1024) {
				const cont = message.cleanContent.substring(i, Math.min(message.cleanContent.length, i + 1024));
				exampleEmbed.addField('Original message [' + ((i / 1024) + 1) + ']: ', cont);
			}
		} else{
			exampleEmbed.addField('Original message: ', 'N/A');
		}
		exampleEmbed.addField('Channel: ', channelName);
		exampleEmbed.setTimestamp(message.createdTimestamp);
		channel.send(exampleEmbed);
		if(!channel) return;
	}
});
client.on('messageUpdate', message=>{
	if(message.author.bot) return;
    if(message.mentions.users.size > 0 || message.mentions.members.size > 0) {
		if (message.channel.id === '733006615325966517' || message.channel.id === '733006780208119894' || message.author.bot) return;
		let channel = message.guild.channels.find(ch => ch.id === '733006615325966517');
		if(channel == null) {
			channel = message.guild.channels.find(ch => ch.id === '733006780208119894');
		}
		const exampleEmbed = new Discord.MessageEmbed();
		const channelName = message.channel.name;
		exampleEmbed.setTitle('Message edited \nGhost ping');
		exampleEmbed.setColor('#ffa6a2');
		exampleEmbed.addField('Author: ', message.author.tag);
		exampleEmbed.addField('Author ID: ', message.author.id);
		// exampleEmbed.addField('Original message: ', message.cleanContent);
		// the field value cannot exceed 1024 characters, so the following fix loops over the original message and devides the content into multiple fields 
		for (let i = 0; i < message.cleanContent.length; i += 1024) {
			const cont = message.cleanContent.substring(i, Math.min(message.cleanContent.length, i + 1024));
			exampleEmbed.addField('Original message [' + ((i / 1024) + 1) + ']: ', cont);
		}		exampleEmbed.addField('Channel: ', channelName);
		exampleEmbed.setTimestamp(message.createdAt);
		channel.send(exampleEmbed);
		if(!channel) return;
	}
	else {
		if (message.channel.id === '733006615325966517' || message.channel.id === '733006780208119894' || message.author.bot) return;
		let channel = message.guild.channels.find(ch => ch.id === '733006615325966517');
		if(channel == null) {
			channel = message.guild.channels.find(ch => ch.id === '733006780208119894');
		}
		const exampleEmbed = new Discord.MessageEmbed();
		const channelName = message.channel.name;
		exampleEmbed.setTitle('Message edited');
		exampleEmbed.setColor('#ffa6a2');
		exampleEmbed.addField('Author: ', message.author.tag);
		exampleEmbed.addField('Author ID: ', message.author.id);
		if (message.cleanContent.length > 0) { // BUGFIX: deleting a message with a nontext content would result into an empty string and crash the bot
			// exampleEmbed.addField('Original message: ', message.cleanContent);
			// the field value cannot exceed 1024 characters, so the following fix loops over the original message and devides the content into multiple fields 
			for (let i = 0; i < message.cleanContent.length; i += 1024) {
				const cont = message.cleanContent.substring(i, Math.min(message.cleanContent.length, i + 1024));
				exampleEmbed.addField('Original message [' + ((i / 1024) + 1) + ']: ', cont);
			}
		} else {
			exampleEmbed.addField('Original message: ', 'N/A');
		}		exampleEmbed.addField('Channel: ', channelName);
		exampleEmbed.setTimestamp(message.createdAt);
		channel.send(exampleEmbed);
		if(!channel) return;
	}
});

client.on('guildMemberUpdate', (oldMember, newMember)=>{
	if (oldMember.displayName != newMember.displayName){
		db.query('UPDATE Member SET display_name=$1 WHERE id_member=$2 AND guild=$3',[newMember.displayName,oldMember.id,oldMember.guild.id],(err,res)=>{
			if (err) {
				return console.log(err.message);
			}
			if (res.rowCount == 0) {
				console.log('<' +newMember.guild.id + '>: could not update a user record');
			} else {
				console.log('<' + newMember.guild.id + '>: a user record has been updated');
			}
		});
		verifyNickname(newMember);
		//console.log(newMember.displayName);
	}
});

client.on('userUpdate', (oldUser, newUser)=>{
	if (oldUser.username != newUser.username){

		client.guilds.forEach(guild => {
			if (guild.member(newUser) != undefined) {

				db.query('UPDATE Member SET username=$1, display_name=$2 WHERE id_member=$3 AND guild=$4', [newUser.username, guild.member(newUser).displayName, newUser.id, guild.id], (err, res) => {
					if (err) {
						return console.log(err.message);
					}
					if (res.rowCount == 0) {
						console.log('<' + guild.id + '>: could not update a user record');
					} else {
						console.log('<' + guild.id + '>: a user record has been updated');
					}
				});


				if (newUser.username == guild.member(newUser).displayName) { // we only wanna verify the new username if it is set as the display name in a server
					verifyNickname(guild.member(newUser));
					//console.log(guild.id+': '+guild.member(newUser).displayName);
				}
			}
		}); 
	}
});



// ## EXPORTED FUNCTIONS ##

module.exports = {
	// Check if mod function
	Mod: function CheckIfMod(userID) {
		const modSplit = client.config.mod.split(',');
		let modUser = false;
		modSplit.forEach(element => {
			if(element.includes(userID)) {
			modUser = true;
		}
		});

		return modUser;
	},

	// Check if admin function
	Admin: function CheckIfAdmin(userID) {
		const adminSplit = client.config.admin.split(',');
			let adminUser = false;
			adminSplit.forEach(element => {
				if(element.includes(userID)) {adminUser = true;}
			});

		return adminUser;
	},
};
client.login(client.config.token);
