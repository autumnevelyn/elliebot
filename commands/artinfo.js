module.exports = {
	name: 'artinfo',
	description: 'Sends info about kanda\'s art setup',
	modOnly: false,
	execute(message) {
		message.channel.send("★ | Kanda is using either Procreate on her iPad Air 2020 or a Wacom Cintiq 16 to draw on in Photoshop CC! Her favorite brushes are from 'Maddy Bellwoar's Ghibli inspired brush set', 'Gouache Maxpack', 'Comics Maxpack' (for comic pages).");
	},
};
