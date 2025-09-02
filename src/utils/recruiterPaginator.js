// src/utils/recruiterPaginator.js
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../prisma/client');

const PAGE_SIZE = 25;

async function displayRecruiterPage(interaction, applicationId, page = 0) {
    const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
    if (!config?.recrutadorRoleId) return interaction.editReply({ content: '❌ Cargo de recrutador não configurado.', components: [] });

    await interaction.guild.members.fetch();
    const allRecruiters = Array.from(interaction.guild.members.cache.filter(m => m.roles.cache.has(config.recrutadorRoleId) && !m.user.bot).values());

    // ===================================================================
    // CORREÇÃO APLICADA AQUI
    // Trocamos 'recruiterId' por 'recrutadorId' para bater com o banco de dados
    // ===================================================================
    const recruitmentCounts = await prisma.application.groupBy({
        by: ['recrutadorId'],
        where: { guildId: interaction.guild.id, status: 'APPROVED' },
        _count: { recrutadorId: true },
    });
    const countsMap = new Map(recruitmentCounts.map(r => [r.recrutadorId, r._count.recrutadorId]));

    allRecruiters.sort((a, b) => {
        const countA = countsMap.get(a.id) || 0;
        const countB = countsMap.get(b.id) || 0;
        if (countB !== countA) return countB - countA;
        return a.user.username.localeCompare(b.user.username);
    });

    const totalPages = Math.ceil(allRecruiters.length / PAGE_SIZE);
    const startIndex = page * PAGE_SIZE;
    const recruitersOnPage = allRecruiters.slice(startIndex, startIndex + PAGE_SIZE);

    if (recruitersOnPage.length === 0 && page === 0) return interaction.editReply({ content: 'Nenhum recrutador encontrado.', components: [] });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('registro_select_recruiter')
        .setPlaceholder(`Selecione um recrutador (Página ${page + 1}/${totalPages})`)
        .addOptions(recruitersOnPage.map(recruiter =>
            new StringSelectMenuOptionBuilder()
                .setLabel(recruiter.displayName)
                .setDescription(`Recrutamentos: ${countsMap.get(recruiter.id) || 0}`)
                .setValue(`${applicationId}_${recruiter.id}`)
                .setEmoji('👤')
        ));
        
    const navButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`recruiter_page_prev_${applicationId}_${page}`).setLabel('< Anterior').setStyle(ButtonStyle.Primary).setDisabled(page === 0),
        new ButtonBuilder().setCustomId(`recruiter_page_next_${applicationId}_${page}`).setLabel('Próxima >').setStyle(ButtonStyle.Primary).setDisabled(page >= totalPages - 1)
    );

    const embed = new EmbedBuilder()
        .setTitle('Seleção de Recrutador')
        .setDescription('Selecione na lista abaixo o recrutador que te auxiliou.\nA lista está ordenada pelos mais ativos.')
        .setFooter({ text: `Página ${page + 1} de ${totalPages}` });

    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu), navButtons], ephemeral: true });
    } else {
        await interaction.update({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu), navButtons], ephemeral: true });
    }
}

module.exports = { displayRecruiterPage };