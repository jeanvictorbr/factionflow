// src/components/buttons/recruiters_action_view_ranking.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'recruiters_action_view_ranking',
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            // ===================================================================
            // CORREÇÃO APLICADA AQUI
            // Trocamos 'recruiterId' por 'recrutadorId' para bater com o banco de dados
            // ===================================================================
            const rankingData = await prisma.application.groupBy({
                by: ['recrutadorId'],
                where: { 
                    guildId: interaction.guild.id, 
                    status: 'APPROVED', 
                    recrutadorId: { not: null } 
                },
                _count: { recrutadorId: true },
                orderBy: { _count: { recrutadorId: 'desc' } },
                take: 10,
            });

            if (rankingData.length === 0) {
                return interaction.editReply({ content: 'Ainda não há recrutamentos aprovados para gerar um ranking.' });
            }
            
            let description = '';
            for (let i = 0; i < rankingData.length; i++) {
                const entry = rankingData[i];
                const user = await interaction.guild.members.fetch(entry.recrutadorId).catch(() => null);
                const userName = user ? user.user.tag : `ID:${entry.recrutadorId}`;
                const count = entry._count.recrutadorId;
                const rankEmoji = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
                description += `${rankEmoji} **${i + 1}.** ${userName} - \`${count}\` recrutamentos\n`;
            }

            const rankingEmbed = new EmbedBuilder()
                .setColor('#F1C40F')
                .setTitle(`🏆 Ranking de Recrutadores - Visionários`)
                .setDescription(description)
                .setFooter({ text: 'Apenas recrutamentos aprovados são contados.' })
                .setTimestamp();
            
            const backButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('view_module_recruiters')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );
            
            await interaction.editReply({ embeds: [rankingEmbed], components: [backButton] });

        } catch (error) {
            console.error("Erro ao gerar ranking:", error);
            await interaction.editReply({ content: 'Ocorreu um erro ao buscar os dados do ranking.' });
        }
    }
};