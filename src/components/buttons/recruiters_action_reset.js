// src/components/buttons/recruiters_action_reset.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'recruiters_action_reset',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('recruiters_modal_reset')
            .setTitle('Resetar Ranking de Recrutadores');
        
        const confirmInput = new TextInputBuilder()
            .setCustomId('confirm_text')
            .setLabel('Digite "RESETAR TUDO" para confirmar')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('AÇÃO IRREVERSÍVEL!')
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(confirmInput));
        await interaction.showModal(modal);
    }
};