// src/components/selects/prune_select_immunity_role.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'prune_select_immunity_role',
    async execute(interaction) {
        const roleId = interaction.values[0];
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { pruneImmunityRoleId: roleId },
            create: { guildId: interaction.guild.id, pruneImmunityRoleId: roleId },
        });
        await interaction.update({ content: `✅ Cargo de imunidade definido com sucesso para <@&${roleId}>!`, components: [] });
    }
};