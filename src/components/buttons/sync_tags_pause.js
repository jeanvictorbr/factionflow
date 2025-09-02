// src/components/buttons/sync_tags_pause.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { activeSyncs } = require('./roletags_action_set_all');
module.exports = {
    customId: 'sync_tags_pause',
    async execute(interaction) {
        const id = interaction.customId.split('_')[3];
        if (activeSyncs.has(id)) activeSyncs.get(id).status = 'PAUSED';
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`sync_tags_resume_${id}`).setLabel('Retomar').setStyle(ButtonStyle.Success).setEmoji('▶️'),
            new ButtonBuilder().setCustomId(`sync_tags_cancel_${id}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('🛑')
        );
        await interaction.update({ components: [buttons] });
    }
};