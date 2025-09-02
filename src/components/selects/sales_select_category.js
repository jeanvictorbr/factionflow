// src/components/selects/sales_select_category.js
const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sales_select_category',
    async execute(interaction) {
        await interaction.deferUpdate();
        const category = interaction.values[0];

        const items = await prisma.item.findMany({
            where: { guildId: interaction.guild.id, category: category },
            orderBy: { name: 'asc' }
        });

        if (items.length === 0) {
             return interaction.editReply({ content: `Não há itens cadastrados na categoria **${category}**.`, components: [] });
        }

        const itemMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('sales_select_calculate_item')
                .setPlaceholder('Selecione o item para calcular...')
                .addOptions(
                    items.map(item => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(item.name)
                            .setDescription(`Preço: $${item.price}`)
                            .setValue(item.id)
                    )
                )
        );
        
        const backButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('sales_back_to_categories') // Usa o novo ID
                .setLabel('Voltar para Categorias')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );
        
        await interaction.editReply({
            content: `Categoria **${category}** selecionada. Agora, escolha o item:`,
            embeds: [],
            components: [itemMenu, backButton],
        });
    }
};