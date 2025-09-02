// src/components/selects/ops_select_channel.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'ops_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { operationsChannelId: channelId },
            create: { guildId: interaction.guild.id, operationsChannelId: channelId },
        });
        await interaction.update({ content: `✅ Canal de operações definido com sucesso para <#${channelId}>!`, components: [] });
    }
};