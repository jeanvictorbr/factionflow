// src/components/buttons/rpainel_view_registros.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'rpainel_view_registros',

    getBackButton: () => {
        return new ButtonBuilder()
            .setCustomId('rpainel_view_registros')
            .setLabel('Voltar para Módulos')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⬅️');
    },

    async execute(interaction) {
        if (!interaction.guild) return;
        await interaction.deferUpdate();

        // 1. Busca TODOS os módulos do banco de dados
        const modules = await prisma.moduleStatus.findMany({ 
            where: { guildId: interaction.guild.id },
            orderBy: { name: 'asc' } // Garante que a ordem é a mesma sempre
        });

        // 2. Cria a embed com os dados dinâmicos do banco
        const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle('Central de Módulos de Configuração')
            .setDescription("Visão geral do status operacional de cada módulo do sistema.\n`🟢 Online` `🟡 Instável` `🔴 Offline`")
            .setFooter({ text: 'Sistema de Gerenciamento FactionFlow -  By zépiqueno...' });
            
        // 3. Adiciona os campos com base nos dados do banco de dados
        modules.forEach(m => {
            let statusEmoji;
            if (m.status === 'ONLINE') statusEmoji = '🟢';
            else if (m.status === 'INSTAVEL') statusEmoji = '🟡';
            else statusEmoji = '🔴';

            embed.addFields({ 
                name: `${statusEmoji} ${m.name}`, 
                value: `**Descrição:** ${m.description}`, 
                inline: true 
            });
        });

        // 4. Cria as action rows com os botões
        const moduleButtonsRow1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('view_module_registro').setLabel('Registro').setStyle(ButtonStyle.Secondary).setEmoji('📥'),
            new ButtonBuilder().setCustomId('view_module_hierarquia').setLabel('Hierarquia').setStyle(ButtonStyle.Secondary).setEmoji('👑'),
            new ButtonBuilder().setCustomId('view_module_financas').setLabel('Finanças').setStyle(ButtonStyle.Secondary).setEmoji('💰'),
            new ButtonBuilder().setCustomId('view_module_sentinel').setLabel('Sentinela').setStyle(ButtonStyle.Secondary).setEmoji('📡'),
            new ButtonBuilder().setCustomId('justica_open_panel').setLabel('Módulo de Conduta').setStyle(ButtonStyle.Primary).setEmoji('⚖️')
        );

        const moduleButtonsRow2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('view_module_roletags').setLabel('Tags').setStyle(ButtonStyle.Secondary).setEmoji('✍️'),
            new ButtonBuilder().setCustomId('view_module_prune').setLabel('Depuração').setStyle(ButtonStyle.Secondary).setEmoji('🧹'),
            new ButtonBuilder().setCustomId('view_module_operations').setLabel('Operações').setStyle(ButtonStyle.Primary).setEmoji('🎯'),
            new ButtonBuilder().setCustomId('view_module_partnerships').setLabel('Parcerias').setStyle(ButtonStyle.Primary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('rpainel_action_create_embed').setLabel('Criar Embed').setStyle(ButtonStyle.Primary).setEmoji('✨')
        );

        // ===================================================================
        // NOVA FILEIRA DE BOTÕES COM O MÓDULO DE SORTEIOS
        // ===================================================================
        const moduleButtonsRow3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('giveaway_open_panel')
                .setLabel('Gerenciar Sorteios')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🎁')
        );

        const backButtonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rpainel_view_main').setLabel('Voltar ao Início').setStyle(ButtonStyle.Danger).setEmoji('🏠')
        );

        // 5. Edita a mensagem com a embed atualizada e todos os botões
        await interaction.editReply({ embeds: [embed], components: [moduleButtonsRow1, moduleButtonsRow2, moduleButtonsRow3, backButtonRow] });
    }
};