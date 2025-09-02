// src/components/modals/justica_add_rule_modal.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'justica_add_rule_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const ruleCode = interaction.fields.getTextInputValue('rule_code');
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

            // A criação não inclui mais o temporaryRoleId
            await prisma.rule.create({
                data: {
                    guildId: interaction.guild.id,
                    ruleCode,
                    description,
                    defaultPunishmentType: punishmentType,
                    defaultDurationMinutes: duration,
                }
            });

            await interaction.editReply(`✅ Regra \`${ruleCode}\` criada com sucesso! Você já pode gerenciá-la no painel.`);
        } catch (error) {
            console.error("Erro ao criar regra:", error);
            await interaction.editReply('❌ Ocorreu um erro. Verifique se o código da regra já existe.');
        }
    }
};