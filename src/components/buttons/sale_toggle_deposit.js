// src/components/buttons/sale_toggle_deposit.js
const { ButtonInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sale_toggle_deposit',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Apenas a liderança pode alterar este status.', ephemeral: true });
        }
        await interaction.deferUpdate();

        const saleId = interaction.customId.split('_')[3];
        const currentSale = await prisma.sale.findUnique({ where: { id: saleId } });
        if (!currentSale) return interaction.followUp({ content: '❌ Venda não encontrada.', ephemeral: true });

        const updatedSale = await prisma.sale.update({
            where: { id: saleId },
            data: { isDeposited: !currentSale.isDeposited },
        });

        const originalEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
        const fields = originalEmbed.data.fields;
        const depositFieldIndex = fields.findIndex(f => f.name === '📥 Depositado');
        const newDepositStatus = updatedSale.isDeposited ? '`✅ Sim`' : '`❌ Não`';

        if (depositFieldIndex !== -1) {
            fields[depositFieldIndex].value = newDepositStatus;
        }
        
        originalEmbed.setColor(updatedSale.isDeposited ? '#2ecc71' : '#e74c3c').setFields(fields);

        await interaction.message.edit({ embeds: [originalEmbed] });
    }
};