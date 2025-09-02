// src/components/modals/justica_edit_rule_modal.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_edit_rule_modal', // Será lido com startsWith
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const ruleId = interaction.customId.split('_').pop();
            
            const description = interaction.fields.getTextInputValue('rule_desc');
            const punishmentType = interaction.fields.getTextInputValue('rule_punishment').toUpperCase();
            const durationStr = interaction.fields.getTextInputValue('rule_duration');

            const validTypes = ['ADVERTENCIA', 'TIMEOUT', 'KICK', 'BAN'];
            if (!validTypes.includes(punishmentType)) {
                return interaction.editReply(`❌ Tipo de punição inválido. Use: ${validTypes.join(', ')}`);
            }
            
            const duration = durationStr ? parseInt(durationStr) : null;
            if (durationStr && isNaN(duration)) {
                return interaction.editReply('❌ A duração deve ser um número.');
            }

            await prisma.rule.update({
                where: { id: ruleId },
                data: {
                    description,
                    defaultPunishmentType: punishmentType,
                    defaultDurationMinutes: duration,
                }
            });

            await interaction.editReply(`✅ Regra atualizada com sucesso!`);
        } catch (error) {
            console.error("Erro ao editar regra:", error);
            await interaction.editReply('❌ Ocorreu um erro ao tentar salvar as alterações.');
        }
    }
};