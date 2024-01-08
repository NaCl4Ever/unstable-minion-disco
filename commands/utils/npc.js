const { SlashCommandBuilder } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
const {npc} = require("../../common/workflows/prompts");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('npc')
		.setDescription('Creates a random DND npc concept picture'),
		async execute(interaction) {		
			await interaction.reply('Working on a cool npc!');
			//Set seeds randomly after importing
			npc.prompt[58].inputs.seed = Math.random() * 19999;
			npc.prompt[82].inputs.seed = Math.random() * 19999;
			
			GenImage(npc, interaction);		
		},
};