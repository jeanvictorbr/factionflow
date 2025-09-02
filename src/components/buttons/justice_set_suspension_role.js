// src/components/buttons/justice_set_suspension_role.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justice_set_suspension_role',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId('justice_select_suspension_role')
                .setPlaceholder('Selecione o cargo para membros suspensos')
        );
        await interaction.reply({ content: 'Selecione no menu o cargo que será automaticamente aplicado a um membro quando ele for suspenso.', components: [selectMenu], ephemeral: true });
    }
};