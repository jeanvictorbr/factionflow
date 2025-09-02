// src/components/buttons/arsenal_action_list_items.js
const { ButtonInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_action_list_items',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const items = await prisma.item.findMany({
            where: { guildId: interaction.guild.id },
            orderBy: { category: 'asc' },
        });

        if (items.length === 0) {
            return interaction.editReply({ content: 'O arsenal está vazio. Adicione itens primeiro.' });
        }

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📋 Inventário de Mercadorias -')
            .setDescription('Lista de todos os itens atualmente catalogados no sistema.');

        // Agrupa os itens por categoria
        const itemsByCategory = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Adiciona um campo para cada categoria
        for (const category in itemsByCategory) {
            const categoryItems = itemsByCategory[category];
            const itemsString = categoryItems
                .map(item => `\`${item.name}\` - **$${item.price}** (Parceria: ${item.partnershipDiscount}%)`)
                .join('\n');
            
            embed.addFields({ name: `--- ${category.toUpperCase()} ---`, value: itemsString });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};