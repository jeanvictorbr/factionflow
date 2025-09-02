// src/components/buttons/arsenal_action_set_log_channel.js
const { ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');

module.exports = {
    customId: 'arsenal_action_set_log_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('arsenal_select_log_channel')
                .setPlaceholder('Selecione o canal para os registros de vendas')
                .addChannelTypes(ChannelType.GuildText) // Garante que só canais de texto possam ser escolhidos
        );

        await interaction.reply({
            content: 'Selecione no menu abaixo o canal onde os registros de todas as vendas serão enviados.',
            components: [selectMenu],
            ephemeral: true,
        });
    }
};