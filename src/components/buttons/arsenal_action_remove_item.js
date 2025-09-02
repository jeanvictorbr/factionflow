// src/components/buttons/arsenal_action_remove_item.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_action_remove_item',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const items = await prisma.item.findMany({ where: { guildId: interaction.guild.id } });

        if (items.length === 0) {
            return interaction.editReply({ content: 'Não há itens no arsenal para remover.' });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('arsenal_select_remove_item')
            .setPlaceholder('Selecione o item que deseja remover...')
            .addOptions(
                items.map(item => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(item.name)
                        .setDescription(`Preço: $${item.price} | Categoria: ${item.category}`)
                        .setValue(item.id) // O valor é o ID único do item
                )
            );

        await interaction.editReply({
            content: 'Selecione no menu abaixo o item que será permanentemente removido do arsenal.',
            components: [new ActionRowBuilder().addComponents(selectMenu)],
        });
    }
};