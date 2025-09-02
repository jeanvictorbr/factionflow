// src/components/buttons/prune_config_immunity_role.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'prune_config_immunity_role',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId('prune_select_immunity_role')
                .setPlaceholder('Selecione o cargo que protegerá os membros')
        );
        await interaction.reply({ content: 'Membros com o cargo selecionado serão **imunes** à limpeza de inativos.', components: [selectMenu], ephemeral: true });
    }
};