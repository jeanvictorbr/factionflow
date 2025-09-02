// src/components/buttons/changelog_manage_dashboard.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'changelog_manage_dashboard',
    async execute(interaction) {
        await interaction.deferUpdate();

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📝 Ferramentas de Gestão do Changelog')
            .setDescription('Use os botões abaixo para criar, alterar ou apagar entradas no registro de alterações, e para gerenciar o painel público.');

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('changelog_action_add')
                .setLabel('Adicionar')
                .setStyle(ButtonStyle.Success)
                .setEmoji('➕'),
            new ButtonBuilder()
                .setCustomId('changelog_action_edit')
                .setLabel('Editar')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('✏️'),
            new ButtonBuilder()
                .setCustomId('changelog_action_remove')
                .setLabel('Remover')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('➖'),
            new ButtonBuilder()
                .setCustomId('changelog_action_publish')
                .setLabel('Publicar/Atualizar Painel')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🚀'),
            new ButtonBuilder()
                .setCustomId('changelog_view_main')
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );
        
        await interaction.editReply({ embeds: [embed], components: [buttons], ephemeral: true });
    }
};