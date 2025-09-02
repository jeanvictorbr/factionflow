// src/components/buttons/justice_lookup_by_select.js
const { ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'justice_lookup_by_select',
    async execute(interaction) {
        const userSelect = new ActionRowBuilder().addComponents(new UserSelectMenuBuilder().setCustomId('justice_select_history_user').setPlaceholder('Selecione o membro para ver a ficha...'));
        await interaction.update({ content: 'Selecione o membro:', components: [userSelect], embeds: [] });
    }
};