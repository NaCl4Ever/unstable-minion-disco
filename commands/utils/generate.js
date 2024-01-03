const { SlashCommandBuilder, Attachment } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate')
		.setDescription('Create a goofy image'),
	async execute(interaction) {
		
		interaction.reply('Yo yo yo i workin');
		console.dir(interaction)
		GenImage("ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner))")
		.then(({data} ) => {		
			interaction.channel.send({content: 'Here is an image'})
			const attachment = [new Attachment(data.output[0])];
			interaction.channel.send({content: 'Here is an image', files: attachment})
		})
        .catch(e => console.error(e.message)
		);
		
	},
};