// src/components/selects/module_status_select_module.js
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'module_status_select_module',
    async execute(interaction) {
        const moduleName = interaction.values[0];
        const selectMenu = new StringSelectMenuBuilder().setCustomId(`module_status_select_status_${moduleName}`).setPlaceholder('Selecione o novo status').addOptions(
            { label: 'Online', value: 'ONLINE', emoji: '🟢' },
            { label: 'Instável', value: 'INSTAVEL', emoji: '🟡' },
            { label: 'Offline', value: 'OFFLINE', emoji: '🔴' }
        );
        await interaction.update({ content: `Selecione o novo status para o módulo **${moduleName}**:`, components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};