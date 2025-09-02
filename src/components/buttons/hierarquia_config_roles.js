// src/components/buttons/hierarquia_config_roles.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'hierarquia_config_roles',
    async execute(interaction) {
        await interaction.deferUpdate();

        const config = await prisma.guildConfig.findUnique({
            where: { guildId: interaction.guild.id }
        });

        // ===================================================================
        // CORREÇÃO APLICADA AQUI
        // Filtramos para remover valores vazios e evitar o erro.
        // ===================================================================
        const excludedRoleIds = config?.hierarchyExcludedRoles?.split(',').filter(id => id) || [];

        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('🛡️ Gerenciamento de Cargos da Hierarquia')
            .setDescription(
                "Use o menu de seleção abaixo para escolher todos os cargos que você quer **ESCONDER** da embed pública.\n\n" +
                "O menu já vem com os cargos atualmente escondidos pré-selecionados. Para mostrar um cargo novamente, basta desmarcá-lo da lista."
            )
            .setFooter({ text: "Sua nova seleção substituirá completamente a anterior." });

        const selectMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId('hierarquia_select_excluded')
                .setPlaceholder('Selecione os cargos para esconder...')
                .setMinValues(0)
                .setMaxValues(25)
                .setDefaultRoles(excludedRoleIds)
        );
        
        const backButtonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('view_module_hierarquia')
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({
            embeds: [embed],
            components: [selectMenu, backButtonRow]
        });
    }
};