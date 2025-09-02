// src/components/modals/giveaway_config_colors_modal.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'giveaway_config_colors_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const activeColor = interaction.fields.getTextInputValue('g_color_active');
        const winnerColor = interaction.fields.getTextInputValue('g_color_winner');
        const finishedColor = interaction.fields.getTextInputValue('g_color_finished');

        // Regex para validar código hexadecimal
        const hexColorRegex = /^#[0-9A-F]{6}$/i;

        if ((activeColor && !hexColorRegex.test(activeColor)) || (winnerColor && !hexColorRegex.test(winnerColor)) || (finishedColor && !hexColorRegex.test(finishedColor))) {
            return interaction.editReply({ content: '❌ Pelo menos uma das cores fornecidas não é um código hexadecimal válido (ex: `#FF0000`).' });
        }

        try {
            await prisma.guildConfig.upsert({
                where: { guildId: interaction.guild.id },
                update: {
                    giveawayEmbedColor: activeColor || null,
                    giveawayWinnerEmbedColor: winnerColor || null,
                    giveawayFinishedEmbedColor: finishedColor || null,
                },
                create: {
                    guildId: interaction.guild.id,
                    giveawayEmbedColor: activeColor || null,
                    giveawayWinnerEmbedColor: winnerColor || null,
                    giveawayFinishedEmbedColor: finishedColor || null,
                }
            });

            await interaction.editReply({ content: '✅ As cores das embeds de sorteio foram atualizadas com sucesso!' });

        } catch (error) {
            console.error('Erro ao salvar cores do sorteio:', error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao tentar salvar as configurações.' });
        }
    }
};