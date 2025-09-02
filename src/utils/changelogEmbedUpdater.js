// src/utils/changelogEmbedUpdater.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../prisma/client');
const ENTRIES_PER_PAGE = 5;

async function updateChangelogEmbed(client, guildId, page = 0) {
    try {
        const config = await prisma.guildConfig.findUnique({ where: { guildId } });
        
        // --- PONTO CRÍTICO ---
        // Se a embed não está atualizando, os IDs abaixo não estão salvos no banco.
        if (!config?.changelogChannelId || !config.changelogMessageId) {
            console.log(`[Updater] IDs do canal ou da mensagem não encontrados para a guilda ${guildId}.`);
            return;
        }

        const channel = await client.channels.fetch(config.changelogChannelId).catch(() => null);
        if (!channel) {
            console.log(`[Updater] Canal de changelog não encontrado para o ID: ${config.changelogChannelId}`);
            return;
        }

        const message = await channel.messages.fetch(config.changelogMessageId).catch(() => null);
        if (!message) {
            console.log(`[Updater] Mensagem de changelog não encontrada para o ID: ${config.changelogMessageId}`);
            return;
        }
        
        // Busca e pagina as entradas
        const totalEntries = await prisma.changelogEntry.count({ where: { guildId } });
        const totalPages = Math.ceil(totalEntries / ENTRIES_PER_PAGE);
        page = Math.max(0, Math.min(page, totalPages - 1));

        const entries = await prisma.changelogEntry.findMany({
            where: { guildId },
            orderBy: { createdAt: 'desc' },
            skip: page * ENTRIES_PER_PAGE,
            take: ENTRIES_PER_PAGE,
        });

        // --- CORREÇÃO DO typeMap ---
        const typeMap = { 'NOVA_FUNCAO': '🚀', 'CORRECAO': '🐛', 'MELHORIA': '✨' };

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🗒️ Registro de Alterações - FactionFlow')
            .setFooter({ text: `Página ${page + 1} de ${totalPages || 1}` });

        if (entries.length === 0) {
            embed.setDescription('> Nenhum registro de alteração encontrado.');
        } else {
            entries.forEach((entry, index) => {
                // Obtém o emoji do mapa, ou usa um padrão se o tipo não for encontrado
                const entryEmoji = typeMap[entry.type] || '🔧';
                const isNewest = page === 0 && index === 0;
                const title = `${isNewest ? '🆕 ' : ''}${entryEmoji} ${entry.title} - \`${entry.version}\``;

                embed.addFields({
                    name: title,
                    value: `> ${entry.description}\n> *Publicado em <t:${Math.floor(entry.createdAt.getTime() / 1000)}:D>*`
                });
            });
        }
        
        const navButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`public_changelog_page_prev_${page}`).setLabel('⬅️ Anterior').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
            new ButtonBuilder().setCustomId(`public_changelog_page_next_${page}`).setLabel('Próxima ➡️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1)
        );

        await message.edit({ embeds: [embed], components: totalPages > 1 ? [navButtons] : [] });
        console.log(`[Updater] Embed de changelog atualizada com sucesso na guilda ${guildId}.`);

    } catch (error) {
        console.error(`[Updater] Falha ao atualizar a embed de changelog:`, error);
    }
}
module.exports = { updateChangelogEmbed };