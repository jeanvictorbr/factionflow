// src/components/selects/arsenal_select_remove_item.js
const { StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_select_remove_item',
    async execute(interaction) {
        const itemId = interaction.values[0];
        const item = await prisma.item.findUnique({ where: { id: itemId } });

        if (!item) {
            return interaction.update({ content: 'Este item não existe mais.', components: [] });
        }

        const confirmButton = new ButtonBuilder()
            .setCustomId(`arsenal_confirm_delete_${itemId}`)
            .setLabel(`Sim, remover ${item.name}`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑️');

        const cancelButton = new ButtonBuilder()
            .setCustomId('arsenal_cancel_delete')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Secondary);

        await interaction.update({
            content: `Você tem certeza que deseja remover o item **${item.name}** do arsenal? **Esta ação não pode ser desfeita.**`,
            components: [new ActionRowBuilder().addComponents(confirmButton, cancelButton)],
        });
    }
};