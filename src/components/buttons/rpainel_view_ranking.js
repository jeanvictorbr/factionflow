// src/components/buttons/rpainel_view_ranking.js
const { ButtonInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'rpainel_view_ranking',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const rankingData = await prisma.application.groupBy({
                by: ['recruiterId'],
                where: {
                    guildId: interaction.guild.id,
                    status: 'APPROVED',
                    recruiterId: { not: null }
                },
                _count: { recruiterId: true, },
                orderBy: { _count: { recruiterId: 'desc', }, },
                take: 10,
            });

            if (rankingData.length === 0) {
                return interaction.editReply({ content: 'Ainda não há recrutamentos aprovados para gerar um ranking.' });
            }
            
            let description = '';
            for (let i = 0; i < rankingData.length; i++) {
                const entry = rankingData[i];
                const rank = (i + 1);
                const count = entry._count.recruiterId;
                const user = await interaction.guild.members.fetch(entry.recruiterId).catch(() => null);
                const userName = user ? user.user.tag : `ID:${entry.recruiterId}`;
                const rankEmoji = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';

                description += `${rankEmoji} **${rank}.** ${userName} - \`${count}\` recrutamentos\n`;
            }

            // EMBED ALTERADA AQUI
            const rankingEmbed = new EmbedBuilder()
                .setColor('#F1C40F')
                .setTitle(`🏆 Ranking de Recrutadores `)
                .setDescription(description)
                .setFooter({ text: 'Apenas recrutamentos aprovados são contados.' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [rankingEmbed] });

        } catch (error) {
            console.error("Erro ao gerar ranking:", error);
            await interaction.editReply({ content: 'Ocorreu um erro ao buscar os dados do ranking.' });
        }
    }
};