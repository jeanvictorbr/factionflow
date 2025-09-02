// src/components/buttons/sales_open_admin_panel.js
const { ButtonInteraction, PermissionFlagsBits } = require('discord.js');
// CAMINHO ATUALIZADO
const financasDashboardHandler = require('./view_module_financas');

module.exports = {
    customId: 'sales_open_admin_panel',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Acesso negado. Esta área é restrita à liderança.', ephemeral: true });
        }
        await financasDashboardHandler.execute(interaction);
    }
};