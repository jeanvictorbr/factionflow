// src/components/modals/justice_modal_punish.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'justice_modal_punish',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const parts = interaction.customId.split('_');
        const targetUserId = parts[3];
        const punishmentType = parts[4];
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        const reason = interaction.fields.getTextInputValue('punish_reason');
        const durationDays = interaction.fields.getTextInputValue('punish_duration');
        
        // LÓGICA DE EXIBIÇÃO DA DURAÇÃO CORRIGIDA
        const durationText = (durationDays && parseInt(durationDays) > 0) ? `\`${durationDays} dia(s)\`` : '`Permanente`';

        if (isNaN(parseInt(durationDays)) || parseInt(durationDays) < 0) {
            return interaction.editReply({ content: '❌ Duração inválida.' });
        }
        
        const data = { u: targetUserId, t: punishmentType, r: reason, d: durationDays };
        const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');

        const previewEmbed = new EmbedBuilder()
            .setColor('#f1c40f').setTitle('⚖️ Pré-visualização da Sentença')
            .setAuthor({ name: `Alvo: ${targetUser.user.tag}`, iconURL: targetUser.displayAvatarURL() })
            .addFields(
                { name: 'Sentença', value: `\`${punishmentType.replace('_', ' ')}\``, inline: true },
                { name: 'Duração', value: durationText, inline: true }, // Usa o texto corrigido
                { name: 'Motivo', value: `\`\`\`${reason}\`\`\`` }
            )
            .setFooter({ text: `Data:${encodedData}` });
        
        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`justice_confirm_punishment`).setLabel('Confirmar Sentença').setStyle(ButtonStyle.Danger).setEmoji('✅'),
            new ButtonBuilder().setCustomId('cancel_action').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
        );
        
        await interaction.editReply({ embeds: [previewEmbed], components: [confirmButtons] });
    }
};