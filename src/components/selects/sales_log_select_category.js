// src/components/selects/sales_log_select_category.js
const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sales_log_select_category',
    async execute(interaction) {
        // CORREÇÃO: Responde ao Discord imediatamente
        await interaction.deferUpdate();

        const category = interaction.values[0];
        const items = await prisma.item.findMany({
            where: { guildId: interaction.guild.id, category: category },
            orderBy: { name: 'asc' }
        });

        // Limita a 25 itens para não quebrar o menu de seleção
        if (items.length > 25) {
             return interaction.editReply({ content: `❌ A categoria **${category}** tem mais de 25 itens. O sistema atual não suporta mais que isso no menu.`, components: [] });
        }

        if (items.length === 0) {
             return interaction.editReply({ content: `Não há itens cadastrados na categoria **${category}**.`, components: []});
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('sales_log_select_item') // Próximo passo
            .setPlaceholder('Selecione o item vendido...')
            .addOptions(items.map(item => 
                new StringSelectMenuOptionBuilder()
                    .setLabel(item.name)
                    .setValue(item.id)
            ));

        // CORREÇÃO: Usa .editReply() para editar a resposta já confirmada
        await interaction.editReply({
            content: `**Registrar Venda (Passo 2/3):** Categoria **${category}** selecionada. Agora, selecione o item.`,
            components: [new ActionRowBuilder().addComponents(selectMenu)],
        });
    }
};