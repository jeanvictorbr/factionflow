// src/components/buttons/justica_revoke_punishment.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_revoke_punishment', // Será lido com startsWith
    async execute(interaction) {
        await interaction.deferUpdate();

        const punishmentId = interaction.customId.split('_').pop();
        
        try {
            const punishment = await prisma.punishment.findUnique({
                where: { id: punishmentId },
                include: { rule: true },
            });

            if (!punishment || punishment.status !== 'ACTIVE') {
                return interaction.followUp({ content: 'Esta punição não está mais ativa ou não foi encontrada.', ephemeral: true });
            }

            // Remove as sanções do Discord
            const guild = interaction.guild;
            const member = await guild.members.fetch(punishment.userId).catch(() => null);
            if (member) {
                if (punishment.rule.defaultPunishmentType === 'TIMEOUT') await member.timeout(null, 'Punição revogada.');
                if (punishment.rule.temporaryRoleId) await member.roles.remove(punishment.rule.temporaryRoleId).catch(() => {});
            }
            if (punishment.rule.defaultPunishmentType === 'BAN') await guild.bans.remove(punishment.userId, 'Punição revogada.').catch(() => {});

            // Atualiza o status no banco de dados
            await prisma.punishment.update({
                where: { id: punishmentId },
                data: { status: 'REVOKED' },
            });
            
            // Edita a mensagem de log original para refletir a revogação
            const originalEmbed = interaction.message.embeds[0];
            const updatedEmbed = new EmbedBuilder(originalEmbed)
                .setColor('White')
                .setTitle(`⚖️ Punição Revogada - Caso #${punishment.caseId}`)
                .setFields(
                    ...originalEmbed.fields.filter(field => field.name !== '⏰ Expira em'),
                    { name: 'Status', value: `⚪ **Revogada por ${interaction.user.tag}**`, inline: true }
                );
            
            // Edita a mensagem e remove os botões
            await interaction.message.edit({ embeds: [updatedEmbed], components: [] });

        } catch (error) {
            console.error("Erro ao revogar punição:", error);
            await interaction.followUp({ content: 'Ocorreu um erro ao tentar revogar esta punição.', ephemeral: true });
        }
    }
};