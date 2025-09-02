// src/components/buttons/mass_dm_action_pause.js
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { activeOperations } = require('../modals/mass_dm_modal_submit');

module.exports = {
    customId: 'mass_dm_action_pause',
    async execute(interaction) {
        const originalInteractionId = interaction.customId.split('_')[4];

        if (originalInteractionId && activeOperations.has(originalInteractionId)) {
            const currentState = activeOperations.get(originalInteractionId);
            currentState.status = 'PAUSED';
        }

        const newButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`mass_dm_action_resume_${originalInteractionId}`).setLabel('Retomar').setStyle(ButtonStyle.Success).setEmoji('▶️'),
            new ButtonBuilder().setCustomId(`mass_dm_action_cancel_${originalInteractionId}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('🛑')
        );

        await interaction.update({
            content: `**[ ⏸️ OPERAÇÃO PAUSADA ]**\nAguardando ordens para retomar ou cancelar.`,
            components: [newButtons],
        });
    }
};