// src/components/buttons/giveaway_set_default_role.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'giveaway_set_default_role',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId('giveaway_select_default_role').setPlaceholder('Selecione um cargo padrão para sorteios...'));
        await interaction.reply({ content: 'Selecione o cargo que será usado como requisito padrão em novos sorteios.', components: [selectMenu], ephemeral: true });
    }
};