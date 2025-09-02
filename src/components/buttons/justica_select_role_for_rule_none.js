// src/components/buttons/justica_select_role_for_rule_none.js
const { showRuleCreationModal } = require('../../utils/justiceModalUtils'); // Reutiliza a mesma função

module.exports = {
    customId: 'justica_select_role_for_rule_none',
    async execute(interaction) {
        await showRuleCreationModal(interaction, null); // Passa 'null' como ID do cargo
    }
};