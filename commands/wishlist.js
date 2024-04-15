module.exports = {
	name: 'wishlist',
	description: 'Links the wishlist.',
	modOnly: false,
	aliases: 'wish',
	execute(message) {
		message.channel.send('★ | https://nookazon.com/profile/4193282738/wishlist');
	},
};
