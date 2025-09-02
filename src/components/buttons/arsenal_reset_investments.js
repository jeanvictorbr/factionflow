// src/components/buttons/arsenal_reset_investments.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'arsenal_reset_investments',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('arsenal_modal_reset_inv').setTitle('Resetar TODOS os Investimentos');
        const confirmInput = new TextInputBuilder().setCustomId('confirm_text').setLabel('Digite "RESETAR INVESTIMENTOS"').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(confirmInput));
        await interaction.showModal(modal);
    }
};