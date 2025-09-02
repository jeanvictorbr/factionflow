// src/components/buttons/justice_confirm_punishment.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'justice_confirm_punishment',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const footerText = interaction.message.embeds[0]?.footer?.text;
            if (!footerText || !footerText.startsWith('Data:')) {
                return interaction.editReply({ content: '❌ Erro: Não foi possível encontrar os dados da punição. A interação pode ter expirado.' });
            }
            const encodedData = footerText.split(':')[1];
            const data = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));
            const { u: targetUserId, t: type, r: reason, d: durationDays } = data;
            
            const targetUser = await interaction.guild.members.fetch(targetUserId).catch(() => null);
            if (!targetUser) return interaction.editReply({ content: '❌ O membro alvo não foi encontrado no servidor.' });

            const author = interaction.user;
            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
            
            let expiresAt = null;
            let previousRolesString = null;
            let finalPunishmentType = type.replace('_', ' '); // Default type for logging
            
            // --- LÓGICA DE SENTENÇA REESTRUTURADA E SEGURA ---

            // APLICA CARGO TEMPORÁRIO (APENAS PARA ADVERTÊNCIAS COM CARGO)
            if (type.startsWith('Advertência_')) {
                const advLevel = type.split('_')[1];
                const suspensionRoleId = config[`adv${advLevel}RoleId`];
                finalPunishmentType = `Advertência (ADV ${advLevel})`;

                if (!suspensionRoleId) {
                    throw new Error(`O cargo de advertência (ADV ${advLevel}) não foi configurado.`);
                }
                
                const rolesToSave = targetUser.roles.cache.filter(role => role.id !== interaction.guild.id && !role.managed).map(role => role.id);
                previousRolesString = rolesToSave.join(',');
                
                await targetUser.roles.set([suspensionRoleId]);
            }
            
            // CALCULA DURAÇÃO (APENAS PARA PUNIÇÕES QUE TÊM DURAÇÃO)
            if (durationDays !== null) {
                const duration = parseInt(durationDays);
                if (duration > 0) {
                    expiresAt = new Date(Date.now() + (duration * 24 * 60 * 60 * 1000));
                }
            }

            // EXECUTA EXPULSÃO
            if (type === 'Expulsão') {
                await targetUser.send(`Você foi expulso do servidor **${interaction.guild.name}**. Motivo: ${reason}`).catch(()=>{});
                await targetUser.kick(`Punido por ${author.tag}. Motivo: ${reason}`);
            }

            // Salva o registro no banco de dados
            await prisma.punishment.create({
                data: { guildId: interaction.guild.id, userId: targetUserId, authorId: author.id, type: finalPunishmentType, reason, expiresAt, previousRoles: previousRolesString }
            });

            // Envia o log no canal configurado
            if (config?.justiceLogChannelId) {
                const logChannel = await interaction.guild.channels.fetch(config.justiceLogChannelId).catch(() => null);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#c0392b').setTitle('⚖️ Novo Registro Disciplinar')
                        .setAuthor({ name: `Aplicado por: ${author.tag}`, iconURL: author.displayAvatarURL() })
                        .addFields(
                            { name: '👤 Membro Punido', value: `${targetUser} (\`${targetUser.id}\`)` },
                            { name: '⚖️ Tipo de Punição', value: `\`\`\`${finalPunishmentType.toUpperCase()}\`\`\``, inline: true },
                            { name: '🛡️ Autoridade', value: `${author}`, inline: true },
                            { name: '📜 Motivo', value: `\`\`\`${reason}\`\`\`` }
                        )
                        .setTimestamp();
                    
                    if (durationDays !== null) {
                        const durationText = parseInt(durationDays) === 0 ? 'Permanente' : `${durationDays} dia(s)`;
                        logEmbed.addFields({ name: '⏳ Duração', value: `\`${durationText}\`` });
                    }
                    
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            
            // Limpa a mensagem de pré-visualização e envia a confirmação final
            await interaction.message.edit({ components: [] }).catch(() => {});
            await interaction.editReply({ content: `✅ Sentença do tipo **${finalPunishmentType}** aplicada a ${targetUser.user.tag} e registrada com sucesso!` });

        } catch (error) {
            console.error("[ERRO NA SENTENÇA]", error);
            // Garante que o admin sempre receba uma resposta, mesmo em caso de erro
            await interaction.editReply({ content: `❌ **Ocorreu um erro:** ${error.message}` });
        }
    }
};