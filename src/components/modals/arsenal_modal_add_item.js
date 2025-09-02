// src/components/modals/arsenal_modal_add_item.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_modal_add_item',
    async execute(interaction) {
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
            await prisma.item.create({
                data: {
                    guildId: interaction.guild.id,
                    name: name,
                    category: category,
                    price: price,
                    partnershipDiscount: discount,
                }
            });

            await interaction.reply({ content: `✅ Item **${name}** adicionado ao arsenal com sucesso!`, ephemeral: true });
        } catch (error) {
            // Código P2002 é o erro de violação de campo único (item com mesmo nome)
            if (error.code === 'P2002') {
                await interaction.reply({ content: `❌ Já existe um item com o nome **${name}**. Use um nome diferente.`, ephemeral: true });
            } else {
                console.error("Erro ao adicionar item:", error);
                await interaction.reply({ content: '❌ Ocorreu um erro ao adicionar o item ao banco de dados.', ephemeral: true });
            }
        }
    }
};