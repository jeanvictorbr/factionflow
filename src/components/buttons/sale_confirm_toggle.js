// src/components/buttons/sale_confirm_toggle.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sale_confirm_toggle',
    async execute(interaction) {
        await interaction.deferUpdate();
        const saleId = interaction.customId.split('_')[3];
        
        const currentSale = await prisma.sale.findUnique({ where: { id: saleId } });
        if (!currentSale) return interaction.editReply({ content: '❌ Venda não encontrada.', components: [] });

        const updatedSale = await prisma.sale.update({
            where: { id: saleId },
            data: { isDeposited: !currentSale.isDeposited },
        });

        // Remonta a embed original com os dados atualizados
        const originalEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
        const fields = originalEmbed.data.fields;
        const depositFieldIndex = fields.findIndex(f => f.name === '📥 Depositado');

        const newDepositStatus = updatedSale.isDeposited ? '`✅ Sim`' : '`❌ Pendente`';
        fields[depositFieldIndex].value = newDepositStatus;
        
        originalEmbed.setColor(updatedSale.isDeposited ? '#2ecc71' : '#e74c3c').setFields(fields);

        await interaction.message.edit({ embeds: [originalEmbed] });
        await interaction.editReply({ content: `✅ Status do depósito da venda **${saleId}** atualizado para **${updatedSale.isDeposited ? "DEPOSITADO" : "PENDENTE"}**.`, components: [] });
    }
};