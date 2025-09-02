// src/components/buttons/cancel_action.js
module.exports = {
    customId: 'cancel_action',
    async execute(interaction) {
        await interaction.update({ content: 'Operação cancelada.', embeds: [], components: [] });
    }
};