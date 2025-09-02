// src/components/buttons/giveaway_open_panel.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'giveaway_open_panel',
    async execute(interaction) {
        await interaction.deferUpdate();
        const embed = new EmbedBuilder().setColor('#3498DB').setTitle('🎁 Painel de Controle de Sorteios').setDescription('Gerencie todos os aspectos dos sorteios do servidor a partir daqui.');
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('giveaway_create_start').setLabel('Criar Sorteio').setStyle(ButtonStyle.Success).setEmoji('✨'),
            new ButtonBuilder().setCustomId('giveaway_list_active').setLabel('Gerenciar Ativos').setStyle(ButtonStyle.Primary).setEmoji('📋'),
            new ButtonBuilder().setCustomId('giveaway_config_panel').setLabel('Configurações').setStyle(ButtonStyle.Secondary).setEmoji('⚙️')
        );
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};