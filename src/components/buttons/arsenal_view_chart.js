// src/components/buttons/arsenal_view_chart.js
const { EmbedBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');
const QuickChart = require('quickchart-js');

module.exports = {
    customId: 'arsenal_view_chart',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const topSellers = await prisma.sale.groupBy({
            by: ['sellerId'], where: { guildId: interaction.guild.id },
            _sum: { totalPrice: true }, orderBy: { _sum: { totalPrice: 'desc' } }, take: 10,
        });

        if (topSellers.length === 0) return interaction.editReply('Não há dados de vendas para gerar um gráfico.');

        const labels = [];
        const data = [];
        for (const seller of topSellers) {
            const user = await interaction.guild.members.fetch(seller.sellerId).catch(() => null);
            labels.push(user ? user.user.username : 'Desconhecido');
            data.push(seller._sum.totalPrice);
        }

        const chart = new QuickChart();
        chart.setWidth(500).setHeight(300).setVersion('2.9.4');
        chart.setConfig({
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{ label: 'Receita de Vendas ($)', data: data, backgroundColor: '#2ecc71', borderColor: '#2c3e50', borderWidth: 2 }]
            },
            options: { legend: { labels: { fontColor: 'white' } }, scales: { yAxes: [{ ticks: { fontColor: 'white' } }], xAxes: [{ ticks: { fontColor: 'white' } }] } }
        });
        
        const chartUrl = await chart.getShortUrl();
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('📈 Gráfico de Performance de Vendas')
            .setDescription('Performance dos Top 10 vendedores da facção baseada em receita gerada.')
            .setImage(chartUrl)
            .setTimestamp();
            
        await interaction.editReply({ embeds: [embed] });
    }
};