// src/components/selects/registro_select_recruiter.js
const { StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client'); // Caminho centralizado

module.exports = {
    customId: 'registro_select_recruiter',
    async execute(interaction) {
        await interaction.deferUpdate();

        const [applicationId, recruiterId] = interaction.values[0].split('_');
        const recruiter = await interaction.guild.members.fetch(recruiterId);

        const confirmEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Confirmação de Operador')
            .setDescription(`Você selecionou **${recruiter.user.username}** como seu recrutador. Está correto?`)
            .setThumbnail(recruiter.user.displayAvatarURL());

        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`registro_confirm_${applicationId}_${recruiterId}`)
                .setLabel('Sim, Confirmar')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
            new ButtonBuilder()
                .setCustomId(`registro_reselect_${applicationId}`)
                .setLabel('Não, Escolher Outro')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✏️')
        );

        await interaction.editReply({
            embeds: [confirmEmbed],
            components: [confirmButtons],
            ephemeral: true,
        });
    },
};