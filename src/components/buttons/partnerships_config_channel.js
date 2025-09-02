// src/components/buttons/partnerships_config_channel.js
const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
module.exports = {
    customId: 'partnerships_config_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('partnerships_select_channel')
                .setPlaceholder('Selecione o canal para a vitrine de parceiros')
                .addChannelTypes(ChannelType.GuildText)
        );
        await interaction.reply({ content: 'Selecione o canal onde o painel público de parcerias será exibido.', components: [selectMenu], ephemeral: true });
    }
};