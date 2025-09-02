// src/tasks/reportGenerator.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../prisma/client');

async function generateAndSendWeeklyReport(guild, client, isPreview = false) {
    const endDate = new Date();
    const startDate = new Date();
    if (isPreview) {
        startDate.setFullYear(startDate.getFullYear() - 1); // Busca no último ano para prévias
    } else {
        startDate.setDate(endDate.getDate() - 7);
    }

    const sales = await prisma.sale.findMany({ where: { guildId: guild.id, createdAt: { gte: startDate, lte: endDate } } });
    const investments = await prisma.investment.findMany({ where: { guildId: guild.id, createdAt: { gte: startDate, lte: endDate } } });
    const topSellersData = await prisma.sale.groupBy({ by: ['sellerId'], where: { guildId: guild.id, createdAt: { gte: startDate, lte: endDate } }, _sum: { totalPrice: true }, orderBy: { _sum: { totalPrice: 'desc' } }, take: 5 });
    const topRecruitersData = await prisma.application.groupBy({ by: ['recrutadorId'], where: { guildId: guild.id, status: 'APPROVED', updatedAt: { gte: startDate, lte: endDate }, recrutadorId: { not: null } }, _count: { recrutadorId: true }, orderBy: { _count: { recrutadorId: 'desc' } }, take: 5 });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const profit = totalRevenue - totalInvestment;
    const profitStatus = profit >= 0 ? 'LUCRO' : 'PREJUÍZO';
    const profitColor = profit >= 0 ? '#2ecc71' : '#e74c3c';

    // Formatação dos rankings
    let topSellersString = topSellersData.length > 0 
        ? topSellersData.map((s, i) => `**${i+1}º.** <@${s.sellerId}>: **$ ${s._sum.totalPrice.toLocaleString('pt-BR')}**`).join('\n')
        : '> Nenhuma venda registrada no período.';
    let topRecruitersString = topRecruitersData.length > 0
        ? topRecruitersData.map((r, i) => `**${i+1}º.** <@${r.recrutadorId}>: **${r._count.recrutadorId}** recrutas`).join('\n')
        : '> Nenhum recrutamento no período.';

    // Monta a embed final
    const reportEmbed = new EmbedBuilder()
        .setColor(profitColor)
        .setTitle(`📡 Relatório de Performance - Visionários`)
        // CORREÇÃO: Garante que a descrição nunca seja vazia
        .setDescription(`Resumo das operações entre **${startDate.toLocaleDateString('pt-BR')}** e **${endDate.toLocaleDateString('pt-BR')}**.` || "Nenhum dado para exibir.")
        .addFields(
            { name: `💰 Resultado do Período: ${profitStatus}`, value: `\`\`\`${profit >= 0 ? '+' : '-'} $ ${Math.abs(profit).toLocaleString('pt-BR')}\`\`\``, inline: false },
            { name: 'Receita Bruta', value: `\`$ ${totalRevenue.toLocaleString('pt-BR')}\``, inline: true },
            { name: 'Investimentos', value: `\`$ ${totalInvestment.toLocaleString('pt-BR')}\``, inline: true },
            { name: '\u200B', value: '\u200B', inline: false },
            { name: '🏆 Top 5 Vendedores', value: topSellersString, inline: true },
            { name: '🎖️ Top 5 Recrutadores', value: topRecruitersString, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Relatório gerado pelo Sistema Sentinela' });

    return reportEmbed;
}

module.exports = { generateAndSendWeeklyReport };