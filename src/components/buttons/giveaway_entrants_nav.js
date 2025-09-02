// src/components/buttons/giveaway_entrants_nav.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

const ENTRIES_PER_PAGE = 20;

module.exports = {
    customId: 'giveaway_entrants_nav', // Será lido com startsWith
    async execute(interaction) {
        await interaction.deferUpdate();

        const [,,, action, messageId, pageStr] = interaction.customId.split('_');
        let page = parseInt(pageStr);

        if (action === 'next') {
            page++;
        } else if (action === 'prev') {
            page--;
        }

        const giveaway = await prisma.giveaway.findUnique({ where: { messageId } });
        if (!giveaway) return;

        const entrants = giveaway.entrants;
        const totalPages = Math.ceil(entrants.length / ENTRIES_PER_PAGE);

        const startIndex = page * ENTRIES_PER_PAGE;
        const pageEntrants = entrants.slice(startIndex, startIndex + ENTRIES_PER_PAGE);
        const entrantMentions = pageEntrants.map((id, index) => `${startIndex + index + 1}. <@${id}>`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#E67E22')
            .setTitle(`👥 Participantes de: ${giveaway.prize}`)
            .setDescription(entrantMentions)
            .setFooter({ text: `Página ${page + 1} de ${totalPages} | Total: ${entrants.length} participantes` });
        
        const navButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`giveaway_entrants_nav_prev_${messageId}_${page}`)
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0), // Desabilita se estiver na primeira página
            new ButtonBuilder()
                .setCustomId(`giveaway_entrants_nav_next_${messageId}_${page}`)
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page >= totalPages - 1) // Desabilita se estiver na última página
        );

        await interaction.editReply({ embeds: [embed], components: [navButtons] });
    }
};