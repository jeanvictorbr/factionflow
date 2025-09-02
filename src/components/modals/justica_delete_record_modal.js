// src/components/modals/justica_delete_record_modal.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_delete_record_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const targetUserId = interaction.customId.split('_').pop();
        const caseIdStr = interaction.fields.getTextInputValue('p_case_id');
        const caseId = parseInt(caseIdStr);

        if (isNaN(caseId)) {
            return interaction.editReply({ content: '❌ O ID do caso deve ser um número.' });
        }

        try {
            // Deleta o registro usando o ID do caso e o ID do servidor
            const deleteResult = await prisma.punishment.deleteMany({
                where: {
                    caseId: caseId,
                    guildId: interaction.guild.id,
                    userId: targetUserId, // Garante que só apague do usuário correto
                }
            });

            if (deleteResult.count > 0) {
                await interaction.editReply(`✅ O registro do Caso #${caseId} foi permanentemente excluído.`);
            } else {
                await interaction.editReply(`❌ Nenhum registro encontrado com o Caso #${caseId} para este usuário.`);
            }
        } catch (error) {
            console.error("Erro ao excluir punição:", error);
            await interaction.editReply('❌ Ocorreu um erro ao tentar excluir o registro do banco de dados.');
        }
    }
};