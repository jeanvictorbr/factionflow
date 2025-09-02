// src/utils/justiceModalUtils.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

async function showRuleCreationModal(interaction, roleId) {
    const modal = new ModalBuilder()
        .setCustomId(`justica_add_rule_modal_${roleId || 'none'}`) // Passa o ID do cargo no customId
        .setTitle('Criar Nova Regra do Código Penal');

    const ruleCodeInput = new TextInputBuilder().setCustomId('rule_code').setLabel('Código da Regra (Ex: 1.1-RDM)').setStyle(TextInputStyle.Short).setRequired(true);
    const descriptionInput = new TextInputBuilder().setCustomId('rule_desc').setLabel('Descrição da Regra').setStyle(TextInputStyle.Short).setRequired(true);
    const punishmentInput = new TextInputBuilder().setCustomId('rule_punishment').setLabel('Punição (ADVERTENCIA, TIMEOUT, KICK, BAN)').setStyle(TextInputStyle.Short).setRequired(true);
    const durationInput = new TextInputBuilder().setCustomId('rule_duration').setLabel('Duração em Minutos (se aplicável)').setStyle(TextInputStyle.Short).setRequired(false);

    modal.addComponents(
        new ActionRowBuilder().addComponents(ruleCodeInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(punishmentInput),
        new ActionRowBuilder().addComponents(durationInput)
    );
    await interaction.showModal(modal);
}

module.exports = { showRuleCreationModal };