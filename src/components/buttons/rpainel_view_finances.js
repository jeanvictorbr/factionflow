// src/components/buttons/rpainel_view_finances.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

// Função para construir o painel. Vamos reutilizar isso depois.
async function buildFinancePanel(interaction) {
    const guildConfig = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
    const targetProfit = guildConfig?.targetProfit;

    let embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('💰 Gerenciamento Financeiro')
        .setDescription('Use os botões abaixo para gerenciar as metas de lucro da facção.')
        .setFooter({ text: 'Sistema de Gerenciamento Visionários' });

    let mainButtons = new ActionRowBuilder();

    // Lógica para exibir a meta ou a mensagem de que não há meta definida
    if (targetProfit) {
        // A gente não tem o valor das vendas, então vamos simular um valor de 0 para o progresso.
        // Você pode substituir esta lógica depois para buscar os valores reais do seu sistema de vendas.
        const currentProfit = 0;
        const progressPercentage = Math.round((currentProfit / targetProfit) * 100);
        const progressBarLength = 10;
        const filledBlocks = Math.floor(progressPercentage / progressBarLength);
        const emptyBlocks = progressBarLength - filledBlocks;
        const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

        embed.addFields(
            { name: '🎯 Meta de Lucro', value: `> **$${targetProfit.toLocaleString('pt-BR')}**`, inline: true },
            { name: '💰 Lucro Atual', value: `> **$${currentProfit.toLocaleString('pt-BR')}**`, inline: true },
            { name: '📈 Progresso', value: `> ${progressBar} ${progressPercentage}%` }
        );

        mainButtons.addComponents(
            new ButtonBuilder()
                .setCustomId('set_profit_goal')
                .setLabel('Atualizar Meta')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🎯'),
            new ButtonBuilder()
                .setCustomId('remove_profit_goal')
                .setLabel('Remover Meta')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️')
        );

    } else {
        embed.setDescription('Nenhuma meta de lucro foi definida. Use o botão abaixo para começar a monitorar o seu progresso.');
        mainButtons.addComponents(
            new ButtonBuilder()
                .setCustomId('set_profit_goal')
                .setLabel('Definir Meta de Lucro')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🎯')
        );
    }

    const backButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('rpainel_view_main')
                .setLabel('Voltar ao Início')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

    return { embeds: [embed], components: [mainButtons, backButton] };
}

module.exports = {
    customId: 'rpainel_view_finances',
    buildPanel: buildFinancePanel,
    async execute(interaction) {
        await interaction.deferUpdate();
        const panel = await buildFinancePanel(interaction);
        await interaction.editReply(panel);
    }
};