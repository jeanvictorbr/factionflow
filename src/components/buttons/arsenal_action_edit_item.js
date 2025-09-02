// src/components/buttons/arsenal_action_edit_item.js
const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_action_edit_item',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const items = await prisma.item.findMany({ 
            where: { guildId: interaction.guild.id },
            orderBy: { name: 'asc' }
        });

        if (items.length === 0) {
            return interaction.editReply({ content: 'Não há itens no arsenal para editar.' });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('arsenal_select_edit_item')
            .setPlaceholder('Selecione o item que deseja editar...')
            .addOptions(
                items.map(item => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(item.name)
                        .setDescription(`Preço: $${item.price} | Categoria: ${item.category}`)
                        .setValue(item.id)
                )
            );

        await interaction.editReply({
            content: 'Selecione no menu abaixo o item cujos dados você deseja alterar.',
            components: [new ActionRowBuilder().addComponents(selectMenu)],
        });
    }
};