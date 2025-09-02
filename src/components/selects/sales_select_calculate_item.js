// src/components/selects/sales_select_calculate_item.js
const { StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'sales_select_calculate_item',
    async execute(interaction) {
        const itemId = interaction.values[0];
        
        const modal = new ModalBuilder()
            .setCustomId(`sales_modal_quantity_${itemId}`)
            .setTitle('Definir Quantidade');
            
        const quantityInput = new TextInputBuilder()
            .setCustomId('sale_quantity')
            .setLabel('Quantidade a ser calculada')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite apenas números. Ex: 100')
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(quantityInput));
        await interaction.showModal(modal);
    }
};