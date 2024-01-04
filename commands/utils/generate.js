const { SlashCommandBuilder } = require('discord.js');
const { GenImage } =  require("../../services/sd-api")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate')
		.setDescription('Create a goofy image'),
	async execute(interaction) {		
		await interaction.reply('One silly lil pic comin right up');
		await GenImage("", interaction);		
	},
};