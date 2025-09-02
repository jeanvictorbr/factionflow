// src/components/buttons/changelog_config_channel.js
const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');

module.exports = {
    customId: 'changelog_config_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('changelog_select_channel')
                .setPlaceholder('Selecione o canal para anunciar as atualizações')
                .addChannelTypes(ChannelType.GuildText)
        );
        await interaction.reply({
            content: 'Selecione o canal onde os novos changelogs serão anunciados publicamente.',
            components: [selectMenu],
            ephemeral: true
        });
    }
};