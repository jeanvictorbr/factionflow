// src/components/buttons/sales_back_to_categories.js
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sales_back_to_categories',
    async execute(interaction) {
        // Edita a mensagem efêmera existente
        await interaction.deferUpdate();

        const categories = await prisma.item.findMany({
            where: { guildId: interaction.guild.id },
            select: { category: true },
            distinct: ['category'],
            orderBy: { category: 'asc' },
        });

        const embed = new EmbedBuilder()
            .setTitle('💹 Calculadora de Vendas')
            .setDescription('Para iniciar, selecione uma categoria de item.')
            .setColor(0xf39c12);

        let components;

        if (categories.length > 0 && categories.length <= 5) {
            const categoryButtons = new ActionRowBuilder().addComponents(
                categories.map(cat => 
                    new ButtonBuilder()
                        .setCustomId(`sales_show_items_${cat.category.replace(/\s+/g, '_')}`)
                        .setLabel(cat.category)
                        .setStyle(ButtonStyle.Secondary)
                )
            );
            components = [categoryButtons];
        } else {
            const categoryMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('sales_select_category')
                    .setPlaceholder('Selecione uma categoria...')
                    .addOptions(categories.map(cat => new StringSelectMenuOptionBuilder().setLabel(cat.category).setValue(cat.category)))
            );
            components = [categoryMenu];
        }

        await interaction.editReply({ 
            embeds: [embed], 
            components: components,
            content: 'Para iniciar o cálculo, comece escolhendo a categoria do item.' 
        });
    }
};