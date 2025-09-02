
// src/components/buttons/rpainel_view_ajuda.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'rpainel_view_ajuda',
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferUpdate();

        const helpEmbed = new EmbedBuilder()
            .setColor('#ffffff') // Branco
            .setTitle('[ ❓ MANUAL DE OPERAÇÕES DO PAINEL ]')
            .setDescription('Guia de referência rápida para os módulos de configuração.')
            .addFields(
                {
                    name: '⚙️ Configurar Registros',
                    value: '`Abre o submenu para gerenciar todo o fluxo de entrada de novos membros. Defina a embed de boas-vindas, os cargos de recrutador/membro e os canais de interação/logs.`'
                },
                {
                    name: '🏆 Ranking de Recrutadores',
                    value: '`Exibe um placar com os operadores que mais realizaram recrutamentos aprovados. Ideal para acompanhar o desempenho e fomentar a competição saudável.`'
                },
                {
                    name: '⬅️ Voltar',
                    value: '`Retorna à tela anterior do menu.`'
                }
            )
            .setFooter({ text: 'Em caso de anomalias, contate o desenvolvedor.' });

        // Botão para voltar ao menu principal
        const backButtonRow = new ActionRowBuilder().addComponents(
             require('../../commands/rpainel').getMainMenuButton() // Supondo que você exporte o botão
        );

        await interaction.editReply({
            embeds: [helpEmbed],
            components: [backButtonRow]
        });
    }
};