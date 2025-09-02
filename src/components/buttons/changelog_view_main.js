// src/components/buttons/changelog_view_main.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const { getMainMenuButton } = require('../../commands/rpainel');

const ENTRIES_PER_PAGE = 3; // Quantas entradas do changelog mostrar por página

module.exports = {
    customId: 'changelog_view_main',
    async execute(interaction, page = 0) {
        // Se a interação veio de um botão (como paginação), defere. Se veio de um modal (senha), já foi deferida.
        if (interaction.isButton()) {
            await interaction.deferUpdate();
        }
        
        const totalEntries = await prisma.changelogEntry.count({ where: { guildId: interaction.guild.id } });
        const totalPages = Math.ceil(totalEntries / ENTRIES_PER_PAGE);
        page = Math.max(0, Math.min(page, totalPages - 1)); // Garante que a página é válida

        const entries = await prisma.changelogEntry.findMany({
            where: { guildId: interaction.guild.id },
            orderBy: { createdAt: 'desc' },
            skip: page * ENTRIES_PER_PAGE,
            take: ENTRIES_PER_PAGE,
        });
        
        const typeMap = {
            'NOVA_FUNCAO': { emoji: '🚀', text: 'Nova Função' },
            'CORRECAO': { emoji: '🐛', text: 'Correção de Bug' },
            'MELHORIA': { emoji: '✨', text: 'Melhoria' },
        };

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🔒 Painel Mestre de Controle')
            .setDescription('Gerencie as notas de versão (Changelog) e o status operacional dos módulos do sistema.')
            .setFooter({ text: `Página ${page + 1} de ${totalPages || 1}` });

        if (entries.length === 0) {
            embed.addFields({ name: 'Changelog Vazio', value: '> Nenhuma entrada encontrada. Use o botão "Adicionar" para começar.' });
        } else {
            entries.forEach(entry => {
                const entryType = typeMap[entry.type] || { emoji: '🔧', text: 'Geral' };
                embed.addFields({
                    name: `${entryType.emoji} ${entry.title} - \`${entry.version}\``,
                    // Adiciona a data de publicação de forma legível
                    value: `> ${entry.description}\n> *Publicado em <t:${Math.floor(entry.createdAt.getTime() / 1000)}:D>*`
                });
            });
        }

        const manageButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('changelog_action_add').setLabel('Adicionar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('changelog_action_edit').setLabel('Editar').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('changelog_action_remove').setLabel('Remover').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('module_status_manage').setLabel('Status dos Módulos').setStyle(ButtonStyle.Secondary).setEmoji('📊')
        );
        
        const navButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`changelog_page_prev_${page}`).setLabel('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
            new ButtonBuilder().setCustomId(`changelog_page_next_${page}`).setLabel('➡️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1),
            new ButtonBuilder().setCustomId(`changelog_config_channel`).setLabel('Config. Canal').setStyle(ButtonStyle.Secondary).setEmoji('📺'),
            getMainMenuButton()
        );
        
        const components = [manageButtons, navButtons];
        
        // Modal de senha já tem uma resposta inicial (deferida), então sempre usamos editReply
        await interaction.editReply({ embeds: [embed], components, ephemeral: true });
    }
};