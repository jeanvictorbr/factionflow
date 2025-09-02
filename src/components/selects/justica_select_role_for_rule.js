// src/components/selects/justica_select_role_for_rule.js
const { showRuleCreationModal } = require('../../utils/justiceModalUtils'); // Criaremos este utilitário

module.exports = {
    customId: 'justica_select_role_for_rule',
    async execute(interaction) {
        const roleId = interaction.values[0];
        await showRuleCreationModal(interaction, roleId);
    }
};