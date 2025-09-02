// src/components/selects/sentinel_select_channel.js
const { ChannelSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sentinel_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];

        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { reportChannelId: channelId },
            create: { guildId: interaction.guild.id, reportChannelId: channelId },
        });

        await interaction.update({
            content: `✅ Canal de relatórios definido com sucesso para <#${channelId}>!`,
            components: [],
        });
    }
};