// src/components/selects/arsenal_select_edit_item.js
const { StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_select_edit_item',
    async execute(interaction) {
        const itemId = interaction.values[0];
        const item = await prisma.item.findUnique({ where: { id: itemId } });

        if (!item) {
            return interaction.update({ content: 'Este item não existe mais.', components: [] });
        }

        // O ID do modal agora inclui o ID do item, para sabermos qual item atualizar
        const modal = new ModalBuilder()
            .setCustomId(`arsenal_modal_edit_submit_${itemId}`)
            .setTitle(`Editando: ${item.name}`);

        const nameInput = new TextInputBuilder().setCustomId('item_name').setLabel('Nome do Item').setStyle(TextInputStyle.Short).setValue(item.name).setRequired(true);
        const categoryInput = new TextInputBuilder().setCustomId('item_category').setLabel('Categoria').setStyle(TextInputStyle.Short).setValue(item.category).setRequired(true);
        const priceInput = new TextInputBuilder().setCustomId('item_price').setLabel('Preço Base (apenas números)').setStyle(TextInputStyle.Short).setValue(item.price.toString()).setRequired(true);
        const discountInput = new TextInputBuilder().setCustomId('item_discount').setLabel('Desconto de Parceria (%)').setStyle(TextInputStyle.Short).setValue(item.partnershipDiscount.toString()).setRequired(false);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(categoryInput),
            new ActionRowBuilder().addComponents(priceInput),
            new ActionRowBuilder().addComponents(discountInput)
        );

        // Esconde a mensagem do menu de seleção e mostra o formulário
        await interaction.showModal(modal);
    }
};