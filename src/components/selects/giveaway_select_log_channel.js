const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_select_log_channel',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channelId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { giveawayLogChannelId: channelId },
            create: { guildId: interaction.guild.id, giveawayLogChannelId: channelId },
        });
        await interaction.editReply(`✅ Canal de logs de sorteios definido para <#${channelId}>!`);
    }
};