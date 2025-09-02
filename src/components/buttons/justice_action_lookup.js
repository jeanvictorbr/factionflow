// src/components/buttons/justice_action_lookup.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'justice_action_lookup',
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor('#3498db').setTitle('🔍 Consulta de Histórico').setDescription('Como você deseja encontrar o membro?');
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('justice_lookup_by_select').setLabel('Selecionar em uma Lista').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('justice_lookup_by_id').setLabel('Digitar o ID').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('view_module_justice').setLabel('Voltar').setStyle(ButtonStyle.Secondary)
        );
        await interaction.update({ embeds: [embed], components: [buttons] });
    }
};