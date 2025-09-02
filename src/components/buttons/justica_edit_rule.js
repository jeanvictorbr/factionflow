// src/components/buttons/justica_edit_rule.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_edit_rule', // Será lido com startsWith
    async execute(interaction) {
        const ruleId = interaction.customId.split('_').pop();
        const rule = await prisma.rule.findUnique({ where: { id: ruleId } });

        if (!rule) {
            return interaction.reply({ content: '❌ Esta regra não foi encontrada. Pode ter sido excluída.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId(`justica_edit_rule_modal_${ruleId}`)
            .setTitle(`Editando Regra: ${rule.ruleCode}`);

        const descriptionInput = new TextInputBuilder().setCustomId('rule_desc').setLabel('Descrição da Regra').setStyle(TextInputStyle.Short).setValue(rule.description).setRequired(true);
        const punishmentInput = new TextInputBuilder().setCustomId('rule_punishment').setLabel('Punição (ADVERTENCIA, TIMEOUT, KICK, BAN)').setStyle(TextInputStyle.Short).setValue(rule.defaultPunishmentType).setRequired(true);
        const durationInput = new TextInputBuilder().setCustomId('rule_duration').setLabel('Duração em Minutos (se aplicável)').setStyle(TextInputStyle.Short).setValue(String(rule.defaultDurationMinutes || '')).setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(descriptionInput),
            new ActionRowBuilder().addComponents(punishmentInput),
            new ActionRowBuilder().addComponents(durationInput)
        );
        
        await interaction.showModal(modal);
    }
};