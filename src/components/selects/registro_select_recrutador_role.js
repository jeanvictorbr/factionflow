// src/components/selects/registro_select_recrutador_role.js
const { RoleSelectMenuInteraction } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    customId: 'registro_select_recrutador_role',
    /**
     * @param {RoleSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        const selectedRoleId = interaction.values[0];
        
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { recrutadorRoleId: selectedRoleId },
            create: { guildId: interaction.guild.id, recrutadorRoleId: selectedRoleId }
        });

        await interaction.reply({
            content: `✅ Cargo de **Recrutador** definido como <@&${selectedRoleId}>.`,
            ephemeral: true
        });

        // Opcional: Atualizar a mensagem do painel para refletir a mudança instantaneamente
        // (Isso requer buscar o handler do botão 'registro_config_cargos' e re-executá-lo)
    }
};