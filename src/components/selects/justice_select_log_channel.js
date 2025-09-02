// src/components/selects/justice_select_log_channel.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justice_select_log_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { justiceLogChannelId: channelId },
            create: { guildId: interaction.guild.id, justiceLogChannelId: channelId },
        });
        await interaction.update({ content: `✅ Canal de logs de conduta definido com sucesso para <#${channelId}>!`, components: [] });
    }
};