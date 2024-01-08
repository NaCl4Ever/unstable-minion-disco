const { SlashCommandBuilder } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
const {waifu} = require("../../common/workflows/prompts");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('waifu')
		.setDescription('Creates a random DND waifu'),
		async execute(interaction) {		
			await interaction.reply('Working on a cool waifu!');
			//Set seeds randomly after importing
			waifu.prompt[58].inputs.seed = Math.random() * 19999;
			waifu.prompt[82].inputs.seed = Math.random() * 19999;
			
			GenImage(waifu, interaction);		
		},
};