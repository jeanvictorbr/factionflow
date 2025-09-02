// src/components/buttons/justica_open_panel.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'justica_open_panel',
    async execute(interaction) {
        // Defer a resposta para garantir que não haja timeout
        await interaction.deferUpdate();

        const embed = new EmbedBuilder()
            .setColor('#2C3E50')
            .setTitle('⚖️ Painel de Controle - Módulo de Justiça')
            .setDescription('Utilize os botões abaixo para gerenciar a conduta, consultar históricos e configurar as regras do servidor.')
            .addFields(
                { name: 'Registrar Punição', value: 'Aplica uma sanção a um membro com base no Código Penal.', inline: true },
                { name: 'Consultar Ficha', value: 'Visualiza o histórico de punições de um membro.', inline: true },
                { name: 'Configurações', value: 'Define o canal de logs e gerencia as regras.', inline: true }
            );

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('justica_register_punishment_start').setLabel('Registrar Punição').setStyle(ButtonStyle.Danger).setEmoji('⚖️'),
                new ButtonBuilder().setCustomId('justica_view_record_start').setLabel('Consultar Ficha').setStyle(ButtonStyle.Primary).setEmoji('📂'),
                new ButtonBuilder().setCustomId('justica_config_panel').setLabel('Configurações').setStyle(ButtonStyle.Secondary).setEmoji('⚙️')
            );

        // Edita a mensagem original com o novo painel
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};