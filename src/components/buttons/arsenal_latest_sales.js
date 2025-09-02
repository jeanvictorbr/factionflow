// src/components/buttons/arsenal_latest_sales.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_latest_sales',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const sales = await prisma.sale.findMany({ where: { guildId: interaction.guild.id }, orderBy: { createdAt: 'desc' }, take: 15 });
        if (sales.length === 0) return interaction.editReply('Nenhuma venda registrada.');
        const salesList = sales.map(s => `**$${s.totalPrice.toLocaleString('pt-BR')}** - ${s.quantity}x ${s.itemName} por <@${s.sellerId}> (<t:${Math.floor(s.createdAt.getTime()/1000)}:R>)`).join('\n');
        const embed = new EmbedBuilder().setColor('#3498db').setTitle('🕙 Últimas 15 Vendas Registradas').setDescription(salesList);
        await interaction.editReply({ embeds: [embed] });
    }
};