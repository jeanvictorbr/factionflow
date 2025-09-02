// src/components/buttons/view_module_recruiters.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'view_module_recruiters',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#e67e22')
            .setTitle('📈 Módulo de Gerenciamento de Recrutadores')
            .setDescription('Ferramentas para analisar e gerenciar o desempenho da linha de frente dos Visionários.')
            .addFields(
                { name: '🏆 Ver Ranking', value: 'Exibe o placar atual dos recrutadores mais eficientes.' },
                { name: '🔄 Resetar Dados', value: 'Zera a contagem de recrutamentos. Use com extremo cuidado.' },
                { name: '➖ Ajustar Contagem', value: 'Remove o último registro de um recrutador específico para corrigir erros.' }
            );

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('recruiters_action_view_ranking').setLabel('Ver Ranking').setStyle(ButtonStyle.Success).setEmoji('🏆'),
            new ButtonBuilder().setCustomId('recruiters_action_reset').setLabel('Resetar Dados').setStyle(ButtonStyle.Danger).setEmoji('🔄')
        );

        // BOTÃO "VOLTAR" CORRIGIDO para apontar para o menu principal
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('recruiters_action_adjust').setLabel('Ajustar Contagem').setStyle(ButtonStyle.Secondary).setEmoji('➖'),
            // O botão é criado diretamente e aponta para o handler rpainel_view_main
            new ButtonBuilder()
                .setCustomId('rpainel_view_main')
                .setLabel('Voltar ao Início')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⬅️')
        );

        // USANDO "update" PARA GARANTIR A EDIÇÃO DA MENSAGEM
        await interaction.update({ embeds: [embed], components: [row1, row2] });
    }
};