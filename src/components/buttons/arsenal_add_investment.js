// src/components/buttons/arsenal_add_investment.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'arsenal_add_investment',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('arsenal_modal_add_investment').setTitle('Adicionar Investimento');
        const amountInput = new TextInputBuilder().setCustomId('inv_amount').setLabel('Valor do Investimento (só números)').setStyle(TextInputStyle.Short).setRequired(true);
        const descInput = new TextInputBuilder().setCustomId('inv_desc').setLabel('Descrição do Gasto').setStyle(TextInputStyle.Paragraph).setPlaceholder('Ex: Compra de 10 Fuzis, Lote de Munição...').setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(amountInput), new ActionRowBuilder().addComponents(descInput));
        await interaction.showModal(modal);
    }
};