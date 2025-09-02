// src/components/modals/justice_modal_lookup_id.js
const historyHandler = require('../selects/justice_select_history_user');
module.exports = {
    customId: 'justice_modal_lookup_id',
    async execute(interaction) {
        // Reutiliza a lógica de exibição do histórico, passando o ID do formulário
        interaction.values = [interaction.fields.getTextInputValue('lookup_user_id')];
        await historyHandler.execute(interaction);
    }
};