// src/components/buttons/justice_view_history.js
const { EmbedBuilder, ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'justice_view_history',
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor('#3498db').setTitle('📜 Consulta de Histórico Disciplinar').setDescription('Selecione no menu abaixo o membro cuja ficha você deseja consultar.');
        const userSelect = new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder().setCustomId('justice_select_history_user').setPlaceholder('Selecione o membro...')
        );
        await interaction.reply({ embeds: [embed], components: [userSelect], ephemeral: true });
    }
};