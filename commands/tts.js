const { SlashCommandBuilder } = require('discord.js');
const {AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require("@discordjs/voice");
const discordTTS = require("discord-tts");
const config = require("../config.json");
let connection;
let message;
let audioPlayer=new AudioPlayer();

const say = (message, client) => {
    const stream = discordTTS.getVoiceStream(message, { lang : client.config.langTTS });
    const audioResource = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});

    connection.subscribe(audioPlayer);
    audioPlayer.play(audioResource);
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Habla a través del bot')
        .addStringOption(option => option.setName('frase').setDescription('Lo que quieras decir').setRequired(true)),
	async execute(interaction, client) {
        if(!interaction.member.voice.channel)
            return interaction.editReply({ ephemeral: true, content: "No estás en un canal de voz" });

        const me = await interaction.guild.members.fetchMe();
        if(me.voice.channel == undefined){
            const voice = interaction.member.voice;
            connection = await joinVoiceChannel({
                channelId: voice.channel.id,
                guildId: voice.channel.guild.id,
                adapterCreator: voice.channel.guild.voiceAdapterCreator,
            });
        }
        message = `${interaction.member.nickname} dice ${interaction.options.getString('frase')}`;
        say(message, client);
        interaction.editReply(message);
	},
    async msgExecute(message, client){
        if(!message.member.voice.channel) return;

        const me = await message.guild.members.fetchMe();
        if(me.voice.channel == undefined){
            const voice = message.member.voice;
            connection = await joinVoiceChannel({
                channelId: voice.channel.id,
                guildId: voice.channel.guild.id,
                adapterCreator: voice.channel.guild.voiceAdapterCreator,
            });
        }
        message = `${message.member.displayName} dice ${message.content}`;
        say(message, client);
    }
};