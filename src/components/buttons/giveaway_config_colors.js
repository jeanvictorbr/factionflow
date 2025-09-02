// src/components/buttons/giveaway_config_colors.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'giveaway_config_colors',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const modal = new ModalBuilder()
            .setCustomId('giveaway_config_colors_modal')
            .setTitle('Personalizar Cores das Embeds');

        const activeColorInput = new TextInputBuilder().setCustomId('g_color_active').setLabel('Cor - Sorteio Ativo (Hexadecimal)').setStyle(TextInputStyle.Short).setPlaceholder('#5865F2').setValue(config?.giveawayEmbedColor || '').setRequired(false);
        const winnerColorInput = new TextInputBuilder().setCustomId('g_color_winner').setLabel('Cor - Anúncio do Vencedor (Hex)').setStyle(TextInputStyle.Short).setPlaceholder('#2ECC71').setValue(config?.giveawayWinnerEmbedColor || '').setRequired(false);
        const finishedColorInput = new TextInputBuilder().setCustomId('g_color_finished').setLabel('Cor - Sorteio Finalizado (Hex)').setStyle(TextInputStyle.Short).setPlaceholder('#99AAB5').setValue(config?.giveawayFinishedEmbedColor || '').setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(activeColorInput),
            new ActionRowBuilder().addComponents(winnerColorInput),
            new ActionRowBuilder().addComponents(finishedColorInput)
        );
        
        await interaction.showModal(modal);
    }
};