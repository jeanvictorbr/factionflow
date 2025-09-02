// src/components/buttons/roletags_action_manage.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'roletags_action_manage',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder().setCustomId('roletags_select_role').setPlaceholder('Selecione o cargo para configurar a TAG')
        );
        await interaction.reply({ content: 'Selecione o cargo que você deseja vincular a uma TAG de apelido.', components: [selectMenu], ephemeral: true });
    }
};