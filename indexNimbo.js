const Discord = require('discord.js');
const config = require('./configNimbo.json');
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
client.config = new Discord.Collection();
client.config.token = config.token;
client.config.admin = config.admin;
client.config.prefix = config.prefix;
client.config.mod = config.mod;
client.config.set(0, config);

// temp: holds channel IDs
const welcomeChannelID = "819720418331459595";
const roleChannelID = "771877311187386400";
const systemMsgChannelID = "698518738009456640";

// temp: holds role IDs
const cozyClubMemberRoleID = "695675462663405628";

const heHimRoleID =      "771880459306663988";
const sheHerRoleID =     "771880394911383583";
const theyThemRoleID =   "771880238883799040";

const artistRoleID =     "698510933923987476";
const streamerRoleID =   "701443270563070023";

const gameBuddyRoleID =  "840754734420066356";
const watchBuddyRoleID = "906696364111560735";


client.once('ready', () => {
	console.log('Nimbot ready!');
});

client.on('message', async message => {

	// monitor nimbot commands sent in 'system_messages' channel
	if (message.channel.id == systemMsgChannelID) {
		
		if (message.content.startsWith("nimbot setup")){
			if (message.content.includes("rules")){
				const welcomeChannel = message.guild.channels.find(c => c.id == welcomeChannelID);
				// post rule message to discord including options
				message.channel.send("Posting rule message in <#"+ welcomeChannelID + ">");

				let embed = new Discord.MessageEmbed()
								.setColor("#FFA3E1")
								.setTitle("» GAIN ACCESS")
								.setDescription("react with ☕ to gain access to the entire server! by reacting, you agree with the rules stated above.");
				let messageEmbed = await welcomeChannel.send(embed);
				messageEmbed.react("☕");

			} else {
				const rolesChannel = message.guild.channels.find(c => c.id == roleChannelID);

				// post msg with pronoun roles
				if (message.content.includes("pronoun roles")) {
					message.channel.send("Posting pronoun roles message in <#" + roleChannelID + ">");

					let embed = new Discord.MessageEmbed()
								.setColor("#A3F3FF")
								.setTitle("» PRONOUNS")
								.setDescription("react with 🟦 to get the <@&"+heHimRoleID+"> role!\n\n" + 
												"react with 🟪 to get the <@&"+sheHerRoleID+"> role!\n\n" + 
												"react with 🟫 to get the <@&"+theyThemRoleID+"> role!");
					let messageEmbed = await rolesChannel.send(embed);
					messageEmbed.react("🟦");
					messageEmbed.react("🟪");
					messageEmbed.react("🟫");

				// post msg with extra roles
				} else if (message.content.includes("additional roles")) {
					message.channel.send("Posting additional roles message in <#" + roleChannelID + ">");

					let embed = new Discord.MessageEmbed()
								.setColor("#FFA3E1")
								.setTitle("» ADDITIONAL ROLES")
								.setDescription("react with 💜 to get the <@&"+streamerRoleID+"> role, to show up separately from other members!\n\n" +
												"react with 🎨 to get the <@&"+artistRoleID+"> role, so we can see you're an artist!");
					let messageEmbed = await rolesChannel.send(embed);
					messageEmbed.react("💜");
					messageEmbed.react("🎨");

				// post msg with activity roles
				} else if (message.content.includes("activity roles")) {
					message.channel.send("Posting activity roles message in <#" + roleChannelID + ">");

					let embed = new Discord.MessageEmbed()
								.setColor("#FEFFA3") 
								.setTitle("» ACTIVITY ROLES")
								.setDescription("react with 🎮 to get the <@&"+gameBuddyRoleID+"> role, so you don't miss when we start games such as gartic phone, dbd, and any other game you want to play with friends.\n\n"+
												"react with 🎞️ to get the <@&"+watchBuddyRoleID+"> role, to find out when we watch movies or shows together.\n\n" +
												"this will make sure you don't miss any fun events happening here in the discord; you'll be pinged! ");
					let messageEmbed = await rolesChannel.send(embed);
					messageEmbed.react("🎮");
					messageEmbed.react("🎞️");

				} else {
					message.channel.send("I don't know that command! Please use [nimbot setup] + [rules / additional roles / pronoun roles / activity roles].");
				}
			}
		}
	}

	// EASTER EGG
	// small chance that nimbot replies with "kandaOpple" if opples are mentioned 🍎
	if (message.content.includes("opple")){
		const r = Math.floor(Math.random() * 100);
		if(r <= 20) {
			return message.channel.send(':kandaOpple:');
		}
	}
});

client.on('messageReactionAdd', async (reaction, user)=> {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	// don't listen to bot's reacts
	if (user.bot) return;
	// only listen to messages in the server
	if (!reaction.message.guild) return;

	// 'welcome' channel
	if (reaction.message.channel.id == welcomeChannelID){
		// 'cozy club member' role
		if (reaction.emoji.name === "☕") {
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == cozyClubMemberRoleID));
		}

	// 'roles' channel
	} else if (reaction.message.channel.id == roleChannelID){

		if (reaction.emoji.name == "💜"){
			// 'streamer' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == artistRoleID));
		
		} else if (reaction.emoji.name == "🎨"){
			// 'artist' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == streamerRoleID));
		
		} else if (reaction.emoji.name == "🟦"){
			// 'he/him' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == heHimRoleID));
		
		} else if (reaction.emoji.name == "🟪"){
			// 'she/her' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == sheHerRoleID));
		
		} else if (reaction.emoji.name == "🟫"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == theyThemRoleID));

		} else if (reaction.emoji.name == "🎮"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == gameBuddyRoleID));

		} else if (reaction.emoji.name == "🎞️"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.add(reaction.message.guild.roles.find(role => role.id == watchBuddyRoleID));
		} 
		
	// do nothing if react is not in a role related channel
	} else {
		return;
	}
});

client.on('messageReactionRemove', async (reaction, user)=> {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	// don't listen to bot's reacts
	if (user.bot) return;
	// only listen to messages in the server
	if (!reaction.message.guild) return;

	// 'welcome' channel
	if (reaction.message.channel.id == welcomeChannelID){
		// 'cozy club member' role
		if (reaction.emoji.name === "☕") {
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == cozyClubMemberRoleID));
		}

	// 'roles' channel
	} else if (reaction.message.channel.id == roleChannelID){

		if (reaction.emoji.name == "💜"){
			// 'streamer' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == artistRoleID));
		
		} else if (reaction.emoji.name == "🎨"){
			// 'artist' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == streamerRoleID));
		
		} else if (reaction.emoji.name == "🟦"){
			// 'he/him' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == heHimRoleID));
		
		} else if (reaction.emoji.name == "🟪"){
			// 'she/her' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == sheHerRoleID));
		
		} else if (reaction.emoji.name == "🟫"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == theyThemRoleID));

		} else if (reaction.emoji.name == "🎮"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == gameBuddyRoleID));
			
		} else if (reaction.emoji.name == "🎞️"){
			// 'they/them' role
			await reaction.message.guild.members.get(user.id).roles.remove(reaction.message.guild.roles.find(role => role.id == watchBuddyRoleID));
		} 
		
	// do nothing if react is not in a role related channel
	} else {
		return;
	}
});

client.login(client.config.token);
