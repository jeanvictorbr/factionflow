// src/components/buttons/mass_dm_action_cancel.js
const { ButtonInteraction } = require('discord.js');
const { activeOperations } = require('../modals/mass_dm_modal_submit');

module.exports = {
    customId: 'mass_dm_action_cancel',
    async execute(interaction) {
        const originalInteractionId = interaction.customId.split('_')[4];

        if (originalInteractionId && activeOperations.has(originalInteractionId)) {
            const currentState = activeOperations.get(originalInteractionId);
            currentState.status = 'CANCELLED';
        }

        await interaction.update({
            content: '**[ 🛑 SINAL DE CANCELAMENTO ENVIADO... ]**\nInterrompendo transmissão.',
            components: [],
        });
    }
};