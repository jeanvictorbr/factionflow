// src/components/selects/hierarquia_select_excluded.js
const { RoleSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'hierarquia_select_excluded',
    async execute(interaction) {
        // Pega os IDs dos cargos selecionados e transforma numa string separada por vírgula
        const excludedRolesString = interaction.values.join(',');

        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { hierarchyExcludedRoles: excludedRolesString },
            create: { guildId: interaction.guild.id, hierarchyExcludedRoles: excludedRolesString },
        });

        // Atualiza a mensagem da interação para dar um feedback claro
        await interaction.update({
            content: `✅ Lista de cargos excluídos atualizada com sucesso! **${interaction.values.length}** cargos estão agora escondidos da hierarquia.`,
            embeds: [], // Limpa a embed
            components: [], // Limpa os botões
        });
    }
};