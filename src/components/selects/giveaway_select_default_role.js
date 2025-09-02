// src/components/selects/giveaway_select_default_role.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_select_default_role',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const roleId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { giveawayDefaultRoleId: roleId },
            create: { guildId: interaction.guild.id, giveawayDefaultRoleId: roleId },
        });
        await interaction.editReply(`✅ Cargo padrão para sorteios definido como <@&${roleId}>!`);
    }
};