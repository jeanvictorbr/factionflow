// src/components/selects/partnerships_select_channel.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'partnerships_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { partnershipChannelId: channelId },
            create: { guildId: interaction.guild.id, partnershipChannelId: channelId },
        });
        await interaction.update({ content: `✅ Canal de parcerias definido com sucesso para <#${channelId}>!`, components: [] });
    }
};