// src/components/selects/sales_log_select_item.js
const { StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sales_log_select_item',
    async execute(interaction) {
        const itemId = interaction.values[0];
        const item = await prisma.item.findUnique({ where: { id: itemId } });

        const modal = new ModalBuilder()
            .setCustomId(`sales_log_modal_details_${itemId}`)
            .setTitle(`Registrando Venda: ${item.name}`);
            
        const quantityInput = new TextInputBuilder()
            .setCustomId('sale_quantity')
            .setLabel('Quantidade Vendida')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite apenas números. Ex: 100')
            .setRequired(true);

        const buyerInput = new TextInputBuilder()
            .setCustomId('sale_buyer_info')
            .setLabel('Nome ou ID do Comprador')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Preencha com o ID no jogo ou nome do comprador.')
            .setRequired(true);
            
        // ===================================================================
        // CAMPO DE DEPÓSITO REINSERIDO AQUI
        // ===================================================================
        const depositedInput = new TextInputBuilder()
            .setCustomId('sale_deposited')
            .setLabel('Depositado no Painel? (Sim/Nao)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite "Sim" ou "Nao"')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(quantityInput),
            new ActionRowBuilder().addComponents(buyerInput),
            new ActionRowBuilder().addComponents(depositedInput)
        );

        await interaction.showModal(modal);
    }
};