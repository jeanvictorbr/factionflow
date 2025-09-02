// src/components/selects/justica_select_user_for_record.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_select_user_for_record',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const targetUserId = interaction.values[0];
        const member = await interaction.guild.members.fetch(targetUserId).catch(() => null);

        if (!member) {
            return interaction.editReply({ content: '❌ Não foi possível encontrar este membro no servidor.' });
        }

        const punishments = await prisma.punishment.findMany({
            where: {
                guildId: interaction.guild.id,
                userId: targetUserId
            },
            include: { rule: true },
            orderBy: { createdAt: 'desc' }
        });

        const statusMap = {
            'ACTIVE': '🔴 Ativa',
            'EXPIRED': '⚫ Expirada',
            'REVOKED': '⚪ Revogada'
        };

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setAuthor({ name: `Ficha de Conduta: ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .setFooter({ text: `${punishments.length} registros encontrados.`})
            .setTimestamp();

        if (punishments.length === 0) {
            embed.setDescription('✅ Nenhuma infração encontrada. Este membro tem a ficha limpa!');
        } else {
            const description = punishments.slice(0, 10).map(p => { // Mostra as últimas 10
                return `**Caso #${p.caseId}** - ${statusMap[p.status]}\n` +
                       `> **Regra:** \`${p.rule.ruleCode}\` - ${p.rule.description}\n` +
                       `> **Staff:** <@${p.moderatorId}>\n` +
                       `> **Data:** <t:${Math.floor(p.createdAt.getTime() / 1000)}:D>`;
            }).join('\n\n');
            embed.setDescription(description);
        }

        const components = [];
        // Adiciona os botões de ação APENAS se houver punições para gerenciar
        if (punishments.length > 0) {
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`justica_delete_record_start_${targetUserId}`)
                        .setLabel('Excluir Registro Único')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🗑️'),
                    
                    // ===================================================================
                    // BOTÃO "EXCLUIR TODOS" ADICIONADO AQUI
                    // ===================================================================
                    new ButtonBuilder()
                        .setCustomId(`justica_delete_all_records_confirm_${targetUserId}`)
                        .setLabel('Excluir Todos')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔥')
                );
            components.push(actionRow);
        }

        await interaction.editReply({ embeds: [embed], components: components });
    }
};