// src/components/buttons/arsenal_action_add_item.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'arsenal_action_add_item',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('arsenal_modal_add_item')
            .setTitle('Adicionar Novo Item ao Arsenal');

        const nameInput = new TextInputBuilder().setCustomId('item_name').setLabel('Nome do Item').setStyle(TextInputStyle.Short).setPlaceholder('Ex: Munição de Fuzil').setRequired(true);
        const categoryInput = new TextInputBuilder().setCustomId('item_category').setLabel('Categoria').setStyle(TextInputStyle.Short).setPlaceholder('Ex: Munição, Arma, Colete').setRequired(true);
        const priceInput = new TextInputBuilder().setCustomId('item_price').setLabel('Preço Base (apenas números)').setStyle(TextInputStyle.Short).setPlaceholder('Ex: 50').setRequired(true);
        const discountInput = new TextInputBuilder().setCustomId('item_discount').setLabel('Desconto de Parceria (%)').setStyle(TextInputStyle.Short).setPlaceholder('Padrão: 50').setValue('50').setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(categoryInput),
            new ActionRowBuilder().addComponents(priceInput),
            new ActionRowBuilder().addComponents(discountInput)
        );

        await interaction.showModal(modal);
    }
};