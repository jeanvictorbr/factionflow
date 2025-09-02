// src/components/buttons/registro_confirm_recruiter.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'registro_confirm',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const parts = interaction.customId.split('_');
        const applicationId = parts[2];
        const recruiterId = parts[3];

        if (!applicationId || !recruiterId) {
            return interaction.editReply({ content: '❌ Erro: ID da aplicação ou do recrutador inválido.' });
        }

        try {
            const application = await prisma.application.update({
                where: { id: applicationId },
                data: { 
                    recrutadorId: recruiterId, 
                    status: 'PENDING_APPROVAL' 
                },
            });

            const candidate = await interaction.guild.members.fetch(application.userId);
            const recruiter = await interaction.guild.members.fetch(recruiterId);
            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

            if (!config?.logsChannelId) {
                return interaction.editReply({ content: '❌ Erro Crítico: O canal de logs não foi configurado.' });
            }

            const analysisEmbed = new EmbedBuilder()
                .setColor('#f1c40f') // Amarelo
                .setTitle(`Análise de Recrutamento: ${candidate.user.tag}`)
                .setDescription('```fix\nSTATUS: AGUARDANDO ANÁLISE\n```') // Status colorido
                .setImage('https://i.imgur.com/f2Esp1T.gif')
                .setThumbnail(candidate.user.displayAvatarURL())
                .addFields(
                    { name: '💻 Alvo', value: `> ${candidate} (\`${candidate.id}\`)` },
                    { name: '👤 Nome RP', value: `> \`${application.rpName}\``, inline: true },
                    { name: '🔗 ID Jogo', value: `> \`${application.gameId}\``, inline: true },
                    { name: '🛡️ Recrutador', value: `> ${recruiter}` }
                )
                .setFooter({ text: `ID da Aplicação: ${application.id}` })
                .setTimestamp();
                
            const actionButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`registro_approve_${application.id}`).setLabel('Aprovar').setStyle(ButtonStyle.Success).setEmoji('✅'),
                new ButtonBuilder().setCustomId(`registro_decline_${application.id}`).setLabel('Recusar').setStyle(ButtonStyle.Danger).setEmoji('❌')
            );
            
            const logsChannel = await interaction.guild.channels.fetch(config.logsChannelId);
            await logsChannel.send({ embeds: [analysisEmbed], components: [actionButtons] });
            
            await interaction.editReply({ content: 'Sua solicitação foi enviada para análise.' });
        } catch (error) {
            console.error("Erro ao confirmar recrutador:", error);
            await interaction.editReply({ content: '❌ Ocorreu um erro crítico ao processar sua confirmação.' });
        }
    },
};