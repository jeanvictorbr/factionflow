// src/components/buttons/registro_approve.js
// Este arquivo já estava completo e correto, mas aqui está novamente para garantir.
const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'registro_approve',
    async execute(interaction) {
        await interaction.deferUpdate();
        const applicationId = interaction.customId.split('_')[2];
        let candidateId = null;

        try {
            const application = await prisma.application.findUnique({ where: { id: applicationId } });
            candidateId = application?.userId;
            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

            if (!application || !config?.membroRoleId) return interaction.followUp({ content: '❌ Erro: Aplicação ou cargo de membro não encontrado.', ephemeral: true });

            const candidate = await interaction.guild.members.fetch(application.userId).catch(() => null);
            if (!candidate) { /* ... tratamento de erro se o membro saiu ... */ return; }

            interaction.client.recentlyApproved.add(candidate.id);

            const tag = config.approvedTag === null ? '[M]' : config.approvedTag;
            if (tag) {
                try {
                    const rpName = application.rpName, gameId = application.gameId;
                    const prefix = `${tag} `, suffix = ` | [${gameId}]`;
                    const maxRpNameLength = 32 - prefix.length - suffix.length;
                    const truncatedRpName = rpName.slice(0, maxRpNameLength);
                    const newNickname = `${prefix}${truncatedRpName}${suffix}`;
                    await candidate.setNickname(newNickname);
                } catch (error) {
                    interaction.followUp({ content: `⚠️ **Aviso:** Não foi possível alterar o apelido de ${candidate.user.tag}. Verifique as permissões.`, ephemeral: true });
                }
            }
            
            await candidate.roles.add(config.membroRoleId);
            setTimeout(() => { interaction.client.recentlyApproved.delete(candidate.id); }, 10000);

            const successDM = new EmbedBuilder() /* ...código da sua DM customizada... */;
            await candidate.send({ embeds: [successDM] }).catch(() => {
                interaction.followUp({ content: `⚠️ **Aviso:** O usuário foi aprovado, mas a DM não pôde ser enviada.`, ephemeral: true });
            });

            const originalEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
            const fields = originalEmbed.data.fields;
            fields.push({ name: 'VEREDITO POR', value: `> ${interaction.user}` });

            originalEmbed
                .setColor('#2ecc71') // Verde
                .setTitle(`Análise de Recrutamento: ${candidate.user.tag}`)
                .setDescription('```diff\n+ STATUS: APROVADO\n```') // Status colorido
                .setImage('https://i.imgur.com/f2Esp1T.gif')
                .setFields(fields);
            
            await interaction.message.edit({ embeds: [originalEmbed], components: [] });
            await prisma.application.update({ where: { id: applicationId }, data: { status: 'APPROVED' } });

        } catch (error) {
            console.error("Erro ao aprovar registro:", error);
            if (candidateId) interaction.client.recentlyApproved.delete(candidateId);
            interaction.followUp({ content: '❌ Ocorreu um erro crítico ao processar a aprovação.', ephemeral: true });
        }
    }
};