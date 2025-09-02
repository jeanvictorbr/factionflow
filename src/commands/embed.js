// src/commands/embed.js
const { SlashCommandBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Inicia o processo de criação de uma embed customizada.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('embed_select_channel')
                .setPlaceholder('Selecione o canal de destino da embed')
                .addChannelTypes(ChannelType.GuildText)
        );
        await interaction.reply({
            content: 'Primeiro, selecione o canal onde a sua embed será publicada.',
            components: [selectMenu],
            ephemeral: true
        });
    }
};