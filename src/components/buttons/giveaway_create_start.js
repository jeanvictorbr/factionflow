const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
module.exports = {
    customId: 'giveaway_create_start',
    async execute(interaction) {
        const channelMenu = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('giveaway_select_channel').setPlaceholder('Selecione o canal para postar o sorteio...').addChannelTypes(ChannelType.GuildText));
        await interaction.reply({ content: '**(Passo 1/3)** Selecione o canal onde o sorteio será realizado:', components: [channelMenu], ephemeral: true });
    }
};