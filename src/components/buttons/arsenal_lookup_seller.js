// src/components/buttons/arsenal_lookup_seller.js
const { ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'arsenal_lookup_seller',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
                .setCustomId('arsenal_select_seller')
                .setPlaceholder('Selecione o vendedor para ver suas vendas.')
        );
        await interaction.reply({ content: 'Selecione o membro para puxar o histórico de vendas:', components: [selectMenu], ephemeral: true });
    }
};