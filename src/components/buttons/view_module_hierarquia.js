// src/components/buttons/view_module_hierarquia.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_hierarquia',
    async execute(interaction) {
        await interaction.deferUpdate();

        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const statusChannel = config?.hierarchyChannelId ? `✅ <#${config.hierarchyChannelId}>` : '⚠️ Pendente';
        const excludedCount = config?.hierarchyExcludedRoles ? config.hierarchyExcludedRoles.split(',').length : 0;
        const statusRoles = `✅ ${excludedCount} cargos excluídos`;
        
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('👑 Módulo de Hierarquia')
            .setImage('https://i.imgur.com/gkahi6j.gif')
            .setDescription('Configure como a estrutura de poder da sua facção será exibida publicamente.')
            .addFields(
                { name: 'Status do Canal', value: statusChannel, inline: true },
                { name: 'Gerenciamento de Cargos', value: statusRoles, inline: true }
            )
            .setFooter({ text: 'A embed de hierarquia é atualizada automaticamente quando um membro muda de cargo.' });

        const configButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('hierarquia_config_text').setLabel('Textos e Imagem').setStyle(ButtonStyle.Secondary).setEmoji('✏️'),
                new ButtonBuilder().setCustomId('hierarquia_config_channel').setLabel('Definir Canal').setStyle(ButtonStyle.Secondary).setEmoji('📺'),
                new ButtonBuilder().setCustomId('hierarquia_config_roles').setLabel('Gerenciar Cargos').setStyle(ButtonStyle.Secondary).setEmoji('🛡️')
            );

        const actionButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('hierarquia_action_publish').setLabel('Publicar / Atualizar').setStyle(ButtonStyle.Success).setEmoji('🚀'),
                // ===================================================================
                // CORREÇÃO APLICADA AQUI
                // O botão "Voltar" foi criado diretamente, sem usar require()
                // ===================================================================
                new ButtonBuilder()
                    .setCustomId('rpainel_view_registros') // Aponta para a tela de seleção de módulos
                    .setLabel('Voltar para Módulos')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        await interaction.editReply({
            embeds: [embed],
            components: [configButtons, actionButtons]
        });
    }
};