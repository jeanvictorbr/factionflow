// src/components/modals/justica_final_modal.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_final_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;
        if (!guild) return;

        try {
            const [,,, targetId, ruleId] = interaction.customId.split('_');
            const reason = interaction.fields.getTextInputValue('p_reason');
            const proof = interaction.fields.getTextInputValue('p_proof') || null;

            // 1. Validações Essenciais
            const rule = await prisma.rule.findUnique({ where: { id: ruleId } });
            const member = await guild.members.fetch(targetId).catch(() => null);
            const config = await prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
            const logChannel = config?.punishmentLogChannelId ? await guild.channels.fetch(config.punishmentLogChannelId).catch(() => null) : null;

            if (!rule || !member || !logChannel) {
                let errorMessage = '❌ Ocorreu um erro ao buscar os dados. Verifique se:\n';
                if (!rule) errorMessage += '- A regra selecionada ainda existe.\n';
                if (!member) errorMessage += '- O membro ainda está no servidor.\n';
                if (!logChannel) errorMessage += '- O canal de logs de punição está configurado corretamente.';
                return interaction.editReply(errorMessage);
            }

            // 2. Criação da Punição
            const updatedConfig = await prisma.guildConfig.update({
                where: { guildId: guild.id },
                data: { lastPunishmentCaseId: { increment: 1 } },
            });
            const newCaseId = updatedConfig.lastPunishmentCaseId;

            const punishment = await prisma.punishment.create({
                data: {
                    caseId: newCaseId,
                    guildId: guild.id,
                    userId: targetId,
                    moderatorId: interaction.user.id,
                    reason,
                    proof,
                    expiresAt: rule.defaultDurationMinutes ? new Date(Date.now() + rule.defaultDurationMinutes * 60 * 1000) : null,
                    ruleId: rule.id
                }
            });

            // 3. Aplicação de Sanções no Discord
            let actionTaken = 'Advertência registrada.';
            if (rule.temporaryRoleId) {
                await member.roles.add(rule.temporaryRoleId).catch(e => console.error(`Falha ao adicionar cargo temporário: ${e.message}`));
            }
            switch (rule.defaultPunishmentType) {
                case 'TIMEOUT':
                    if (rule.defaultDurationMinutes) {
                        await member.timeout(rule.defaultDurationMinutes * 60 * 1000, `Caso #${newCaseId}: ${rule.description}`);
                        actionTaken = `Membro silenciado por ${rule.defaultDurationMinutes} minutos.`;
                    }
                    break;
                case 'KICK':
                    await member.kick(`Caso #${newCaseId}: ${rule.description}`);
                    actionTaken = 'Membro expulso do servidor.';
                    break;
                case 'BAN':
                    await member.ban({ reason: `Caso #${newCaseId}: ${rule.description}` });
                    actionTaken = 'Membro banido do servidor.';
                    break;
            }

            // 4. Envio de Logs e Notificações
            const logEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle(`⚖️ Punição Registrada - Caso #${punishment.caseId}`)
                // ===================================================================
                // LINHA ADICIONADA: Define a foto do membro como thumbnail
                // ===================================================================
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: '👤 Membro Punido', value: `> <@${member.id}> (\`${member.id}\`)`, inline: false },
                    { name: '👮 Staff Responsável', value: `> <@${interaction.user.id}> (\`${interaction.user.id}\`)`, inline: false },
                    { name: '📜 Regra Violada', value: `> **\`${rule.ruleCode}\`**: ${rule.description}`, inline: false },
                    { name: '📋 Detalhes do Staff', value: `> ${reason}`, inline: false },
                    { name: '⏳ Punição Aplicada', value: `> **${actionTaken}**`, inline: true },
                    { name: '⏰ Expira em', value: `> ${punishment.expiresAt ? `<t:${Math.floor(punishment.expiresAt.getTime() / 1000)}:R>` : '`Permanente`'}`, inline: true }
                )
                .setTimestamp();
            if (proof) {
                logEmbed.addFields({ name: '📸 Prova', value: `> [Clique aqui para visualizar](${proof})` });
            }
            
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`justica_revoke_punishment_${punishment.id}`)
                        .setLabel('Revogar Punição')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('↩️')
                );

            const logMessage = await logChannel.send({ embeds: [logEmbed], components: [actionRow] });

            await prisma.punishment.update({
                where: { id: punishment.id },
                data: { punishmentMessageId: logMessage.id }
            });

            await member.send({ content: `Você recebeu uma punição no servidor **${guild.name}**. Caso #${punishment.caseId}` }).catch(() => {});
            
            await interaction.editReply(`✅ Punição **Caso #${punishment.caseId}** registrada com sucesso para ${member}.`);

        } catch (error) {
            console.error(`Erro no modal ${module.exports.customId}:`, error);
            await interaction.editReply({ content: '❌ Um erro inesperado aconteceu ao processar o formulário.' });
        }
    }
};