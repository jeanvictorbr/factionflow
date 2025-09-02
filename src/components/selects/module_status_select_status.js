// src/components/selects/module_status_select_status.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'module_status_select_status',
    async execute(interaction) {
        const moduleName = interaction.customId.split('_')[4];
        const status = interaction.values[0];
        
        // Corrija o 'where' para usar 'name' e 'name_guildId'
        await prisma.moduleStatus.update({
            where: { name_guildId: { name: moduleName, guildId: interaction.guild.id } },
            data: { status }
        });
        
        await interaction.update({ content: `✅ Status do módulo **${moduleName}** alterado para **${status}** com sucesso!`, components: [] });
    }
};