// src/components/buttons/ops_config_channel.js
const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
module.exports = {
    customId: 'ops_config_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('ops_select_channel').setPlaceholder('Selecione o canal para postar as operações').addChannelTypes(ChannelType.GuildText));
        await interaction.reply({ content: 'Selecione o canal onde os painéis de operação serão criados.', components: [selectMenu], ephemeral: true });
    }
};