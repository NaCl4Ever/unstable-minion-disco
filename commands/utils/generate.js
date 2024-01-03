const { SlashCommandBuilder, Attachment } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate')
		.setDescription('Create a goofy image'),
	async execute(interaction) {
		
		await interaction.reply('One silly lil pic comin right up');
		GenImage("ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner))")
		.then(async ( _ ) => {		
			// const attachment = [new Attachment(data.output[0])];
			await interaction.followUp({content: 'Worked so far'})
		})
        .catch(e => console.error(e.message)
		);
		
	},
};