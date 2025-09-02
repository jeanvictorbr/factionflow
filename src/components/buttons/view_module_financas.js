// src/components/buttons/view_module_financas.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_financas',
    async execute(interaction) {
        await interaction.deferUpdate();
        
        const itemCount = await prisma.item.count({ where: { guildId: interaction.guild.id } });
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const logChannelStatus = config?.salesLogChannelId ? `✅ <#${config.salesLogChannelId}>` : '⚠️ Não Definido';

        const embed = new EmbedBuilder()
            .setColor('#f39c12')
            .setTitle('💰 Painel de Gestão: Finanças e Arsenal')
            .setDescription('Hub de gerenciamento do catálogo de itens e análise de dados financeiros.')
            .setImage('https://i.imgur.com/62PxV3k.gif')
            .addFields(
                { name: 'Itens Catalogados', value: `\`\`\`${itemCount} itens\`\`\``, inline: true },
                { name: 'Canal de Logs de Vendas', value: logChannelStatus, inline: true }
            );

        // Fileira de botões para gerenciamento do catálogo
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('arsenal_action_add_item').setLabel('Adicionar Item').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('arsenal_action_edit_item').setLabel('Editar Item').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
            new ButtonBuilder().setCustomId('arsenal_action_remove_item').setLabel('Remover Item').setStyle(ButtonStyle.Danger).setEmoji('➖'),
            new ButtonBuilder().setCustomId('arsenal_action_list_items').setLabel('Listar Itens').setStyle(ButtonStyle.Secondary).setEmoji('📋')
        );
        // Fileira de botões para análise e configuração
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('arsenal_action_view_stats').setLabel('Ver Estatísticas').setStyle(ButtonStyle.Success).setEmoji('📊'),
            new ButtonBuilder().setCustomId('arsenal_action_set_log_channel').setLabel('Config. Canal Logs').setStyle(ButtonStyle.Primary).setEmoji('📢'),
            // ===================================================================
            // BOTÃO ADICIONADO AQUI
            // ===================================================================
            new ButtonBuilder().setCustomId('arsenal_edit_panel_image').setLabel('Config. Imagem').setStyle(ButtonStyle.Primary).setEmoji('🖼️')
        );
        // Fileira de navegação
        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('rpainel_view_registros')
                .setLabel('Voltar para Módulos')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
    }
};