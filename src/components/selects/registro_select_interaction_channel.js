// src/components/selects/registro_select_interaction_channel.js
const { ChannelSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
// Importa apenas a "fábrica"
const { buildPanel } = require('../buttons/registro_config_canais');

module.exports = {
    customId: 'registro_select_interaction_channel',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        const selectedChannelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { interactionChannelId: selectedChannelId },
            create: { guildId: interaction.guild.id, interactionChannelId: selectedChannelId }
        });

        // Usa a "fábrica" para obter a nova aparência do painel
        const updatedPanel = await buildPanel(interaction);
        // Usa editReply para atualizar a mensagem original
        await interaction.editReply(updatedPanel);
    }
};