// src/components/buttons/arsenal_confirm_delete.js
const { ButtonInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_confirm_delete',
    async execute(interaction) {
        const itemId = interaction.customId.split('_')[3];
        
        try {
            const deletedItem = await prisma.item.delete({ where: { id: itemId } });
            await interaction.update({ content: `✅ O item **${deletedItem.name}** foi removido com sucesso!`, components: [] });
        } catch (error) {
            await interaction.update({ content: `❌ Erro ao remover o item. Ele pode já ter sido removido.`, components: [] });
        }
    }
};