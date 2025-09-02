// src/components/selects/arsenal_select_seller.js
const { UserSelectMenuInteraction, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_select_seller',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.values[0];
        const user = await interaction.guild.members.fetch(userId);

        const sales = await prisma.sale.findMany({
            where: { sellerId: userId, guildId: interaction.guild.id },
            orderBy: { createdAt: 'desc' }
        });

        if (sales.length === 0) {
            return interaction.editReply({ content: `Nenhum registro de venda encontrado para ${user.displayName}.` });
        }

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        const salesList = sales
            .slice(0, 10) // Mostra as últimas 10 vendas
            .map(sale => `↳ **${sale.quantity}x ${sale.itemName}** por **$${sale.totalPrice.toLocaleString('pt-BR')}** (<t:${Math.floor(sale.createdAt.getTime() / 1000)}:R>)`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setAuthor({ name: `Histórico de Vendas de ${user.user.tag}`, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: 'Vendas Totais', value: `\`${sales.length}\``, inline: true },
                { name: 'Receita Gerada', value: `\`$ ${totalRevenue.toLocaleString('pt-BR')}\``, inline: true },
                { name: 'Últimas Vendas Registradas', value: salesList }
            );
        
        await interaction.editReply({ embeds: [embed] });
    }
};