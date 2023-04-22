module.exports = {
	name: 'interactionCreate',
    once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;
        
	    const command = client.commands.get(interaction.commandName);

	    if (!command) return;

    	try {
			await interaction.deferReply();
			client.channel = interaction.channel;
            
			await command.execute(interaction, client);
	    } catch (error) {
		    console.error(error);
    		await interaction.editReply({ content: 'Hubo un error con este comando', ephemeral: true });
	    }
	},
};