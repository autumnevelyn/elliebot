module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	adminOnly: true,
	execute(message, args) {
		const commandName = args[0].toLowerCase();

		if(commandName == 'config') {
			delete require.cache[require.resolve('../config.json')];
			try {
				const newConfig = require('../config.json');
				message.client.config.token = newConfig.token;
				message.client.config.admin = newConfig.admin;
				message.client.config.mod = newConfig.mod;
				message.client.config.prefix = newConfig.prefix;
				message.client.config.set(0, newConfig);
			}
			catch (error) {
				console.log(error);
				return message.channel.send('There was an error while reloading config.');
			}
			return message.channel.send('Config was reloaded!');
		}

		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${commandName}.js`)];

		try {
			const newCommand = require(`./${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		}
		catch (error) {
			console.log(error);
			return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${commandName}\` was reloaded!`);
	},
};
