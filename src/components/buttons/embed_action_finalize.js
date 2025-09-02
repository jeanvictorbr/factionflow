// src/components/buttons/embed_action_finalize.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'embed_finalize',
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor('#e74c3c').setDescription('**⚠️ Tem certeza que deseja finalizar esta embed?**\nOs botões de edição serão removidos permanentemente.');
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`embed_confirm_finalize_${interaction.message.id}`).setLabel('Sim, Finalizar').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_action').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
        );
        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    }
};