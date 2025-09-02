const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('justica')
        .setDescription('Abre o painel de controle do Módulo de Justiça.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Apenas staff pode ver

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2C3E50')
            .setTitle('⚖️ Painel de Controle de Justiça')
            .setDescription('Utilize os botões abaixo para gerenciar a conduta dos membros no servidor.')
            .addFields(
                { name: 'Registrar Punição', value: 'Aplica uma sanção a um membro com base no Código Penal.', inline: true },
                { name: 'Consultar Ficha', value: 'Visualiza o histórico de punições de um membro.', inline: true },
                { name: 'Configurações', value: 'Define o canal de logs e gerencia as regras.', inline: true }
            );

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('justica_register_punishment').setLabel('Registrar Punição').setStyle(ButtonStyle.Danger).setEmoji('⚖️'),
                new ButtonBuilder().setCustomId('justica_view_record').setLabel('Consultar Ficha').setStyle(ButtonStyle.Primary).setEmoji('📂'),
                new ButtonBuilder().setCustomId('justica_config').setLabel('Configurações').setStyle(ButtonStyle.Secondary).setEmoji('⚙️')
            );

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    }
};