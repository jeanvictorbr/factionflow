// src/utils/partnershipEmbedUpdater.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../prisma/client');

const PARTNERS_PER_PAGE_DOSSIER = 1; // 1 parceiro por página no modo dossiê

async function updatePartnershipEmbed(client, guildId, page = 0, viewMode = 'dossier') {
    try {
        const config = await prisma.guildConfig.findUnique({ where: { guildId } });
        if (!config?.partnershipChannelId || !config.partnershipMessageId) return;
        
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return;

        const channel = await client.channels.fetch(config.partnershipChannelId).catch(() => null);
        if (!channel) return;
        const message = await channel.messages.fetch(config.partnershipMessageId).catch(() => null);
        if (!message) return;

        const allPartners = await prisma.partnership.findMany({ where: { guildId }, orderBy: { name: 'asc' } });
        
        if (allPartners.length === 0) {
            const emptyEmbed = new EmbedBuilder().setColor('#1abc9c').setTitle('🤝 Alianças Estratégicas').setDescription('> Nenhuma parceria registrada no momento.');
            return message.edit({ embeds: [emptyEmbed], components: [] });
        }
        
        const embed = new EmbedBuilder().setColor('#1abc9c').setThumbnail(config.partnershipDefaultThumbnailUrl || guild.iconURL());
        const components = [];

        if (viewMode === 'dossier') {
            const totalPages = allPartners.length;
            page = Math.max(0, Math.min(page, totalPages - 1));
            const partnerToShow = allPartners[page];

            embed.setTitle('🤝 Dossiê de Aliança Estratégica').setFooter({ text: `👑 FactionFlow - By zepiqueno • Parceiro ${page + 1} de ${totalPages}` });

            if (partnerToShow && partnerToShow.imageUrl) {
                embed.setImage(partnerToShow.imageUrl);
            } else {
                embed.setImage(config.partnershipDefaultImageUrl || null);
            }
            
            let description = `### 💎 **${partnerToShow.name.toUpperCase()}**\n`;
            description += `\`\`\`diff\n- Ramo: ${partnerToShow.category}\n\`\`\`\n`;
            description += `> ${partnerToShow.description.replace(/\n/g, '\n> ')}\n`;
            if (partnerToShow.inviteUrl) {
                description += `> 🔗 **[Conectar ao Servidor](${partnerToShow.inviteUrl})**`;
            }
            embed.setDescription(description);

            const navButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`partnership_page_prev_${page}`).setLabel('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
                new ButtonBuilder().setCustomId(`partnership_page_next_${page}`).setLabel('➡️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1),
                new ButtonBuilder().setCustomId(`partnership_view_list_${page}`).setLabel('Ver Lista Completa').setStyle(ButtonStyle.Primary).setEmoji('📋')
            );
            if (partnerToShow.uniformImageUrl) {
                navButtons.addComponents(new ButtonBuilder().setCustomId(`view_partner_uniform_${partnerToShow.id}`).setLabel(`Ver Uniforme`).setStyle(ButtonStyle.Secondary).setEmoji('👕'));
            }
            components.push(navButtons);

        } else { // MODO LISTA
            embed.setTitle('📋 Lista de Todas as Alianças')
                 .setDescription('Selecione um parceiro no menu abaixo para ver seu dossiê detalhado.')
                 .setFooter({ text: '👑 FactionFlow - By zepiqueno' });
            
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('partnerships_select_partner_from_list')
                .setPlaceholder('Selecione um parceiro...')
                .addOptions(allPartners.slice(0, 25).map(p => 
                    new StringSelectMenuOptionBuilder().setLabel(p.name).setDescription(`Ramo: ${p.category}`).setValue(p.id).setEmoji('🤝')
                ));
            components.push(new ActionRowBuilder().addComponents(selectMenu));
            
            const backButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`partnership_view_dossier_${page}`).setLabel('↩️ Voltar ao Dossiê').setStyle(ButtonStyle.Secondary)
            );
            components.push(backButton);
        }

        await message.edit({ embeds: [embed], components: components });
    } catch (error) {
        console.error(`[Updater] Falha ao atualizar a embed de parcerias:`, error);
    }
}

module.exports = { updatePartnershipEmbed };