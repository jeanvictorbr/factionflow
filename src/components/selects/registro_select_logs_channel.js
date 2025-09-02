// src/components/selects/registro_select_logs_channel.js
const { ChannelSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
const { buildPanel } = require('../buttons/registro_config_canais');

module.exports = {
    customId: 'registro_select_logs_channel',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        const selectedChannelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { logsChannelId: selectedChannelId },
            create: { guildId: interaction.guild.id, logsChannelId: selectedChannelId }
        });

        const updatedPanel = await buildPanel(interaction);
        await interaction.editReply(updatedPanel);
    }
};