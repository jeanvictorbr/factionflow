// src/components/buttons/arsenal_date_report.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'arsenal_date_report',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('arsenal_modal_date_report').setTitle('Relatório de Vendas por Período');
        const startDateInput = new TextInputBuilder().setCustomId('start_date').setLabel('Data de Início (AAAA-MM-DD)').setStyle(TextInputStyle.Short).setPlaceholder('Ex: 2025-08-01').setRequired(true);
        const endDateInput = new TextInputBuilder().setCustomId('end_date').setLabel('Data de Fim (AAAA-MM-DD)').setStyle(TextInputStyle.Short).setPlaceholder('Ex: 2025-08-31').setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(startDateInput), new ActionRowBuilder().addComponents(endDateInput));
        await interaction.showModal(modal);
    }
};