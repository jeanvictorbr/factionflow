// src/components/modals/arsenal_modal_date_report.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_modal_date_report',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const startDateStr = interaction.fields.getTextInputValue('start_date');
        const endDateStr = interaction.fields.getTextInputValue('end_date');
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return interaction.editReply('❌ Formato de data inválido. Use AAAA-MM-DD.');
        }
        
        const sales = await prisma.sale.findMany({ where: { guildId: interaction.guild.id, createdAt: { gte: startDate, lte: endDate } } });
        const investments = await prisma.investment.findMany({ where: { guildId: interaction.guild.id, createdAt: { gte: startDate, lte: endDate } } });
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const profit = totalRevenue - totalInvestment;

        const embed = new EmbedBuilder()
            .setColor(profit >= 0 ? '#2ecc71' : '#e74c3c')
            .setTitle(`Relatório de Vendas: ${startDateStr} a ${endDateStr}`)
            .addFields(
                { name: 'Vendas no Período', value: `\`${sales.length}\``, inline: true },
                { name: 'Receita no Período', value: `\`$ ${totalRevenue.toLocaleString('pt-BR')}\``, inline: true },
                { name: 'Investimento no Período', value: `\`$ ${totalInvestment.toLocaleString('pt-BR')}\``, inline: true },
                { name: 'Resultado', value: profit >= 0 ? `**LUCRO de $ ${profit.toLocaleString('pt-BR')}**` : `**PREJUÍZO de $ ${Math.abs(profit).toLocaleString('pt-BR')}**` }
            );
        await interaction.editReply({ embeds: [embed] });
    }
};