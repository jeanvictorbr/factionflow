// src/components/modals/arsenal_modal_edit_submit.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_modal_edit_submit',
    async execute(interaction) {
        const itemId = interaction.customId.split('_')[4];

        const name = interaction.fields.getTextInputValue('item_name');
        const category = interaction.fields.getTextInputValue('item_category');
        const priceStr = interaction.fields.getTextInputValue('item_price');
        const discountStr = interaction.fields.getTextInputValue('item_discount') || '50';

        const price = parseInt(priceStr);
        const discount = parseInt(discountStr);

        if (isNaN(price) || isNaN(discount)) {
            return interaction.reply({ content: '❌ O preço e o desconto devem ser apenas números.', ephemeral: true });
        }

        try {
            await prisma.item.update({
                where: { id: itemId },
                data: {
                    name: name,
                    category: category,
                    price: price,
                    partnershipDiscount: discount,
                }
            });

            await interaction.reply({ content: `✅ Item **${name}** atualizado com sucesso!`, ephemeral: true });
        } catch (error) {
            console.error("Erro ao editar item:", error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao atualizar o item. O nome pode já estar em uso por outro item.', ephemeral: true });
        }
    }
};