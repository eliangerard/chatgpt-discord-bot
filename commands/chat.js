const { SlashCommandBuilder } = require('discord.js');
const { addSpeechEvent } = require("discord-speech-recognition");
const { AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel } = require("@discordjs/voice");
const { getAudioBuffer } = require("simple-tts-mp3");
let audioPlayer=new AudioPlayer();

const say = async (message, client) => {
    const audioResource = createAudioResource(getAudioBuffer(message, client.config.langTTS));

    client.connection.subscribe(audioPlayer);
    audioPlayer.play(audioResource);
}

let conversationId, parentMessageId;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Envía un mensaje a chat gpt')
        .addStringOption(option => option.setName('query').setDescription('Tu mensaje').setRequired(true)),
    inVoice: false,
    voiceCommand: ['chat', 'sat', 'isaac'],
    async execute(interaction, client) {
        const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
        const query = interaction.options.getString('query');

        const api = new ChatGPTUnofficialProxyAPI({
            accessToken: client.config.gptAccessToken,
            apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
        })
        let res;
        if (conversationId)
            res = await api.sendMessage(query, {
                conversationId, parentMessageId, onProgress: (progress) => {
                    interaction.editReply({ content: progress.text, ephemeral: false });
                }
            })
        else {
            res = await api.sendMessage(query, {
                onProgress: (progress) => {
                    interaction.editReply({ content: progress.text, ephemeral: false });
                }
            });
            conversationId = res.conversationId;
            parentMessageId = res.parentMessageId;
        }

        return interaction.editReply({ content: res.text, ephemeral: false });
    },
    async executeVoice(content, msg, client) {
        const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');

        const api = new ChatGPTUnofficialProxyAPI({
            accessToken: client.config.gptAccessToken,
            apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
        })
        let res;
        console.log("Content: -"+content);
        let response = "";
        try {
            res = await api.sendMessage(content, { onProgress : (progress) => {
                response = progress.text;
            }});
            return say(res.text, client);
        } catch(e) {
            return say(response, client);
        }
    }
};