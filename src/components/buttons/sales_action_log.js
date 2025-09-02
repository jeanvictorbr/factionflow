// src/components/buttons/sales_action_log.js
const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sales_action_log',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const categories = await prisma.item.findMany({
            where: { guildId: interaction.guild.id },
            select: { category: true },
            distinct: ['category'],
        });

        if (categories.length === 0) {
            return interaction.editReply({ content: 'O arsenal está vazio. Impossível registrar vendas.' });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('sales_log_select_category') // Leva para o próximo passo do FLUXO DE REGISTRO
            .setPlaceholder('Selecione a categoria do item vendido...')
            .addOptions(categories.map(cat => 
                new StringSelectMenuOptionBuilder().setLabel(cat.category).setValue(cat.category)
            ));

        await interaction.editReply({
            content: '**Registrar Venda (Passo 1/3):** Selecione a categoria do item vendido.',
            components: [new ActionRowBuilder().addComponents(selectMenu)],
        });
    }
};