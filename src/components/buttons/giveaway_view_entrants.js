// src/components/buttons/giveaway_view_entrants.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

const ENTRIES_PER_PAGE = 20; // Quantos participantes mostrar por página

module.exports = {
    customId: 'giveaway_view_entrants',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // CORREÇÃO: Busca o sorteio usando o ID da MENSAGEM onde o botão foi clicado.
        const messageId = interaction.message.id;
        const giveaway = await prisma.giveaway.findUnique({ where: { messageId } });

        if (!giveaway) {
            return interaction.editReply({ content: '❌ Sorteio não encontrado no banco de dados. Pode ter sido encerrado ou houve um erro.' });
        }

        const entrants = giveaway.entrants;
        const totalPages = Math.ceil(entrants.length / ENTRIES_PER_PAGE);
        const page = 0; // Sempre começa na primeira página (página 0)

        const pageEntrants = entrants.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE);
        const entrantMentions = pageEntrants.map((id, index) => `${index + 1}. <@${id}>`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#E67E22')
            .setTitle(`👥 Participantes de: ${giveaway.prize}`)
            .setDescription(entrants.length > 0 ? entrantMentions : 'Ninguém participou deste sorteio ainda.')
            .setFooter({ text: `Página ${page + 1} de ${totalPages || 1} | Total: ${entrants.length} participantes` });

        const navButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`giveaway_entrants_nav_prev_${messageId}_${page}`)
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true), // Desabilitado na primeira página
            new ButtonBuilder()
                .setCustomId(`giveaway_entrants_nav_next_${messageId}_${page}`)
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(totalPages <= 1) // Desabilitado se só houver uma página
        );

        await interaction.editReply({ embeds: [embed], components: totalPages > 1 ? [navButtons] : [] });
    }
};