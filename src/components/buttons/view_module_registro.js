// src/components/buttons/view_module_registro.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_registro',
    async execute(interaction) {
        await interaction.deferUpdate();

        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const embedStatus = config?.registroEmbedTitle ? '✅ Configurada' : '⚠️ Pendente';
        const rolesStatus = (config?.recrutadorRoleId && config?.membroRoleId) ? '✅ Configurados' : '⚠️ Pendente';
        const channelsStatus = (config?.interactionChannelId && config?.logsChannelId) ? '✅ Configurados' : '⚠️ Pendente';

        const embed = new EmbedBuilder()
            .setColor('#1abc9c')
            .setTitle('📥 Módulo de Registro')
            .setImage('https://i.imgur.com/gkahi6j.gif')
            .setDescription('Painel dedicado à configuração do fluxo de entrada de novos membros.')
            .addFields(
                { name: '📝 Status da Embed', value: `\`${embedStatus}\``, inline: true },
                { name: '🎖️ Status dos Cargos', value: `\`${rolesStatus}\``, inline: true },
                { name: '📺 Status dos Canais', value: `\`${channelsStatus}\``, inline: true }
            )
            .setFooter({ text: 'Todos os passos devem estar configurados para o sistema funcionar.' });

        const configButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('registro_config_embed').setLabel('Editar Embed').setStyle(ButtonStyle.Secondary).setEmoji('📝'),
                new ButtonBuilder().setCustomId('registro_config_cargos').setLabel('Definir Cargos').setStyle(ButtonStyle.Secondary).setEmoji('🎖️'),
                new ButtonBuilder().setCustomId('registro_config_canais').setLabel('Definir Canais').setStyle(ButtonStyle.Secondary).setEmoji('📺')
            );
        
        const actionButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('registro_enviar_painel').setLabel('Publicar Registro').setStyle(ButtonStyle.Success).setEmoji('🚀'),
                // ===================================================================
                // CORREÇÃO APLICADA AQUI
                // O botão "Voltar" foi criado diretamente para evitar o erro.
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