// src/components/selects/blacklist_select_remove.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'blacklist_select_remove',
    async execute(interaction) {
        const userIdToRemove = interaction.values[0];

        try {
            await prisma.blacklist.delete({
                where: {
                    guildId_userId: {
                        guildId: interaction.guild.id,
                        userId: userIdToRemove,
                    }
                }
            });
            await interaction.update({ content: `✅ O usuário com ID \`${userIdToRemove}\` foi removido da blacklist com sucesso!`, components: [] });
        } catch (error) {
            console.error("Erro ao remover da blacklist:", error);
            await interaction.update({ content: `❌ Ocorreu um erro ao remover este usuário. Ele pode já ter sido removido.`, components: [] });
        }
    }
};