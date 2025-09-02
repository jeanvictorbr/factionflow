// src/components/buttons/registro_decline.js
const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'registro_decline',
    async execute(interaction) {
        await interaction.deferUpdate();
        const applicationId = interaction.customId.split('_')[2];

        try {
            const application = await prisma.application.findUnique({ where: { id: applicationId } });
            if (!application) return interaction.followUp({ content: '❌ Erro: Aplicação não encontrada.', ephemeral: true });

            const candidate = await interaction.guild.members.fetch(application.userId).catch(() => null);
            if (candidate) {
                const declineDM = new EmbedBuilder()
                    .setColor('#e74c3c')
                    .setTitle('[ 🔴 SEU REGISTRO FOI RECUSADO ]')
                    .setAuthor({ name: 'SISTEMA DE PROTOCOLO BABILÔNIA', iconURL: interaction.guild.iconURL() })
                    .setDescription('Após análise da liderança, sua solicitação de entrada não foi aprovada no momento.')
                    .setFooter({ text: 'Agradecemos seu interesse.' })
                    .setTimestamp();
                await candidate.send({ embeds: [declineDM] }).catch(() => {
                    interaction.followUp({ content: `⚠️ **Aviso:** O usuário foi recusado, mas não foi possível enviar a DM.`, ephemeral: true });
                });
            }

            const originalEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
            const fields = originalEmbed.data.fields;
            fields.push({ name: 'VEREDITO POR', value: `> ${interaction.user}` });

            originalEmbed
                .setColor('#e74c3c') // Vermelho
                .setTitle(`Análise de Recrutamento: ${candidate ? candidate.user.tag : 'Usuário Desconhecido'}`)
                .setDescription('```diff\n- STATUS: RECUSADO\n```') // Status colorido
                .setImage('https://i.imgur.com/f2Esp1T.gif')
                .setFields(fields);

            await interaction.message.edit({ embeds: [originalEmbed], components: [] });
            await prisma.application.update({ where: { id: applicationId }, data: { status: 'REJECTED' } });

        } catch (error) {
            console.error("Erro ao recusar registro:", error);
            interaction.followUp({ content: '❌ Ocorreu um erro crítico ao processar a recusa.', ephemeral: true });
        }
    }
};