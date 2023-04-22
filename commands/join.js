const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Conecta el bot al canal de voz'),
	async execute(interaction, client) {
        if(!interaction.member.voice.channel)
            return interaction.editReply({ ephemeral: true, content: "No estás en un canal de voz" });
        
        const voice = interaction.member.voice;
        client.connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: voice.channel.guild.id,
            adapterCreator: voice.channel.guild.voiceAdapterCreator,
            selfDeaf : false
        });
        
		const embed = new EmbedBuilder()
                .setTitle(" Listo")
                .setColor("#FFFFFF");

        interaction.editReply( { embeds: [embed] } ).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
	},
};