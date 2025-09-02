// src/components/buttons/sentinel_set_channel.js
const { ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');

module.exports = {
    customId: 'sentinel_set_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('sentinel_select_channel')
                .setPlaceholder('Selecione o canal para os relatórios')
                .addChannelTypes(ChannelType.GuildText)
        );

        await interaction.reply({
            content: 'Selecione no menu abaixo o canal onde os relatórios semanais serão enviados.',
            components: [selectMenu],
            ephemeral: true,
        });
    }
};