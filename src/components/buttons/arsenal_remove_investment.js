// src/components/buttons/arsenal_remove_investment.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_remove_investment',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const investments = await prisma.investment.findMany({ where: { guildId: interaction.guild.id }, orderBy: { createdAt: 'desc' }});
        if (investments.length === 0) return interaction.editReply('Nenhum investimento para remover.');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('arsenal_select_remove_inv')
            .setPlaceholder('Selecione o investimento para apagar...')
            .addOptions(investments.slice(0, 25).map(inv =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(`$${inv.amount.toLocaleString('pt-BR')} - ${inv.description.slice(0, 50)}`)
                    .setValue(inv.id)
            ));
        
        await interaction.editReply({ content: 'Selecione um investimento da lista para remover:', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};