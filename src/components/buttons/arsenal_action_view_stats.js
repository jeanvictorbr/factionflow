// src/components/buttons/arsenal_action_view_stats.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    customId: 'arsenal_action_view_stats',
    async execute(interaction) {
        await interaction.deferUpdate();
        
        const logEmbed = new EmbedBuilder().setColor('#2c3e50').setTitle('[ ACESSANDO TERMINAL DE DADOS... ]');
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 📡 Conectando ao mainframe... ]`')], components: [] });
        await sleep(1000);

        const sales = await prisma.sale.findMany({ where: { guildId: interaction.guild.id } });
        const investments = await prisma.investment.findMany({ where: { guildId: interaction.guild.id } });
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 📡 Conexão segura estabelecida. ]`\n`[ 🔑 Descriptografando logs... ]`')] });
        await sleep(1200);
        
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const profit = totalRevenue - totalInvestment;
        
        // ===================================================================
        // LÓGICA DO TOP 10 VENDEDORES RESTAURADA
        // ===================================================================
        const topSellers = await prisma.sale.groupBy({
            by: ['sellerId'],
            where: { guildId: interaction.guild.id },
            _sum: { totalPrice: true },
            orderBy: { _sum: { totalPrice: 'desc' } },
            take: 10,
        });

        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 🔑 Descriptografia... OK ]`\n`[ 🏆 Calculando performance... ]`\n**[ ✅ DADOS CARREGADOS ]**')] });
        await sleep(800);

        let topSellersString = '';
        if (topSellers.length > 0) {
            const promises = topSellers.map(async (seller, i) => {
                const user = await interaction.guild.members.fetch(seller.sellerId).catch(() => null);
                const revenue = seller._sum.totalPrice.toLocaleString('pt-BR');
                const userName = user ? user.user.tag : `ID: ${seller.sellerId}`;
                if (i === 0) return `\`\`\`diff\n- 🥇 ${userName}: $ ${revenue}\n\`\`\``;
                if (i === 1) return `\`\`\`fix\n🥈 ${userName}: $ ${revenue}\n\`\`\``;
                if (i === 2) return `\`\`\`ini\n[🥉 ${userName}: $ ${revenue}]\n\`\`\``;
                return `**${i + 1}.** ${user || '`Usuário Desconhecido`'}: **$ ${revenue}**`;
            });
            const results = await Promise.all(promises);
            topSellersString = results.join('\n');
        } else {
            topSellersString = '> Nenhum vendedor no ranking.';
        }

        const profitStatus = profit >= 0 ? `Estamos operando no **LUCRO**.` : `Estamos operando no **PREJUÍZO**.`;
        const profitColor = profit >= 0 ? '#2ecc71' : '#e74c3c';

        const finalEmbed = new EmbedBuilder()
            .setColor(profitColor)
            .setTitle('📊 Dashboard de Inteligência Financeira')
            .setDescription(`**Status do Período:** ${profitStatus}`)
            .addFields(
                { name: '💰 Receita Bruta', value: `\`\`\`diff\n+ $ ${totalRevenue.toLocaleString('pt-BR')}\n\`\`\``, inline: true },
                { name: '💸 Investimentos', value: `\`\`\`diff\n- $ ${totalInvestment.toLocaleString('pt-BR')}\n\`\`\``, inline: true },
                { name: '📈 Lucro Líquido', value: `\`\`\`${profit >= 0 ? '+' : '-'} $ ${Math.abs(profit).toLocaleString('pt-BR')}\`\`\``, inline: true },
                { name: '🏆 Top 10 Vendedores', value: topSellersString }
            )
            .setFooter({ text: 'Sistema de Gestão Visionários' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('arsenal_lookup_seller').setLabel('Consultar Vendedor').setStyle(ButtonStyle.Primary).setEmoji('🔍'),
            new ButtonBuilder().setCustomId('arsenal_latest_sales').setLabel('Últimas Vendas').setStyle(ButtonStyle.Secondary).setEmoji('🕙'),
            new ButtonBuilder().setCustomId('arsenal_date_report').setLabel('Relatório por Data').setStyle(ButtonStyle.Secondary).setEmoji('📅')
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('arsenal_manage_investments').setLabel('Gerenciar Investimentos').setStyle(ButtonStyle.Success).setEmoji('💸'),
            new ButtonBuilder().setCustomId('arsenal_reset_sales').setLabel('Resetar Vendas').setStyle(ButtonStyle.Danger).setEmoji('🗑️'),
            new ButtonBuilder().setCustomId('view_module_financas').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
        );
        
        await interaction.editReply({ embeds: [finalEmbed], components: [row1, row2] });
    }
};