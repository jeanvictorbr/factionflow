// src/components/selects/hierarquia_select_channel.js
const { ChannelSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'hierarquia_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];

        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { hierarchyChannelId: channelId },
            create: { guildId: interaction.guild.id, hierarchyChannelId: channelId }
        });

        await interaction.update({
            content: `✅ Canal da hierarquia definido com sucesso para <#${channelId}>!`,
            embeds: [],
            components: [],
        });
    }
};