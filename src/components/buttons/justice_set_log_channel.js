// src/components/buttons/justice_set_log_channel.js
const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');

module.exports = {
    customId: 'justice_set_log_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('justice_select_log_channel')
                .setPlaceholder('Selecione o canal para os logs de punições')
                .addChannelTypes(ChannelType.GuildText)
        );
        await interaction.reply({ content: 'Selecione no menu o canal onde os registros de todas as punições serão enviados.', components: [selectMenu], ephemeral: true });
    }
};