const { SlashCommandBuilder } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
const {husbaindu} = require("../../common/workflows/prompts");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('husbaindu')
		.setDescription('Creates a random DND husbaindu'),
		async execute(interaction) {		
			await interaction.reply('Working on a cool husbaindu!');
			//Set seeds randomly after importing
			husbaindu.prompt[58].inputs.seed = Math.random() * 19999;
			husbaindu.prompt[82].inputs.seed = Math.random() * 19999;
			
			GenImage(husbaindu, interaction);		
		},
};