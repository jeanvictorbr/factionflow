// src/components/buttons/arsenal_reset_sales.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'arsenal_reset_sales',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('arsenal_modal_reset_sales').setTitle('Resetar TODAS as Vendas');
        const confirmInput = new TextInputBuilder().setCustomId('confirm_text').setLabel('Digite "RESETAR VENDAS" para confirmar').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(confirmInput));
        await interaction.showModal(modal);
    }
};