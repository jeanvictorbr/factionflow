// src/components/buttons/sync_tags_cancel.js
const { activeSyncs } = require('./roletags_action_set_all');
module.exports = {
    customId: 'sync_tags_cancel',
    async execute(interaction) {
        const id = interaction.customId.split('_')[3];
        if (activeSyncs.has(id)) activeSyncs.get(id).status = 'CANCELLED';
        await interaction.update({ content: 'Sinal de cancelamento enviado. Aguardando finalização do ciclo atual...', embeds: [], components: [] });
    }
};