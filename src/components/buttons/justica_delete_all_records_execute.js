// src/components/buttons/justica_delete_all_records_execute.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_delete_all_records_execute',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const targetUserId = interaction.customId.split('_').pop();

        try {
            // Deleta TODOS os registros de punição para aquele usuário no servidor atual
            const deleteResult = await prisma.punishment.deleteMany({
                where: {
                    userId: targetUserId,
                    guildId: interaction.guild.id
                }
            });

            if (deleteResult.count > 0) {
                await interaction.editReply(`✅ **${deleteResult.count}** registros de punição foram permanentemente excluídos para o usuário. A ficha dele está limpa.`);
            } else {
                await interaction.editReply('ℹ️ O membro já não tinha registros de punição para serem excluídos.');
            }
        } catch (error) {
            console.error("Erro ao excluir todos os registros de punição:", error);
            await interaction.editReply('❌ Ocorreu um erro ao tentar limpar os registros do banco de dados.');
        }
    }
};