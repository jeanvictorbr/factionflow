// src/components/selects/registro_select_membro_role.js
const { RoleSelectMenuInteraction } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    customId: 'registro_select_membro_role',
    /**
     * @param {RoleSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        const selectedRoleId = interaction.values[0];
        
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { membroRoleId: selectedRoleId },
            create: { guildId: interaction.guild.id, membroRoleId: selectedRoleId }
        });

        await interaction.reply({
            content: `✅ Cargo de **Membro Registrado** definido como <@&${selectedRoleId}>.`,
            ephemeral: true
        });
    }
};