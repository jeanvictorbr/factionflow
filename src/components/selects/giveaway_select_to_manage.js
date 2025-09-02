const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_select_to_manage',
    async execute(interaction) {
        await interaction.deferUpdate();
        const messageId = interaction.values[0];
        const giveaway = await prisma.giveaway.findUnique({ where: { messageId } });
        const embed = new EmbedBuilder().setColor('#9B59B6').setTitle(`Gerenciando: ${giveaway.prize}`).setDescription(`Este sorteio termina <t:${Math.floor(giveaway.endsAt.getTime() / 1000)}:R> e tem **${giveaway.entrants.length}** participantes.`);
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`giveaway_reroll_${messageId}`).setLabel('Sortear Novamente').setStyle(ButtonStyle.Primary).setEmoji('🔄'),
            new ButtonBuilder().setCustomId(`giveaway_end_${messageId}`).setLabel('Encerrar Agora').setStyle(ButtonStyle.Danger).setEmoji('❌'),
            new ButtonBuilder().setCustomId(`giveaway_view_entrants_${messageId}`).setLabel('Ver Participantes').setStyle(ButtonStyle.Secondary).setEmoji('👥'),
            new ButtonBuilder().setCustomId('giveaway_list_active').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
        );
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};