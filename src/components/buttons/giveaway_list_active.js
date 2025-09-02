const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_list_active',
    async execute(interaction) {
        await interaction.deferUpdate();
        const activeGiveaways = await prisma.giveaway.findMany({ where: { guildId: interaction.guild.id, status: 'RUNNING' } });
        const embed = new EmbedBuilder().setColor('#3498DB').setTitle('📋 Sorteios Ativos');
        if (activeGiveaways.length === 0) embed.setDescription('Nenhum sorteio ativo no momento.');
        else activeGiveaways.forEach(g => embed.addFields({ name: `🎁 ${g.prize}`, value: `Termina em: <t:${Math.floor(g.endsAt.getTime() / 1000)}:R> | ID: \`${g.messageId}\`` }));

        const components = [];
        if (activeGiveaways.length > 0) {
            const selectMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('giveaway_select_to_manage').setPlaceholder('Selecione um sorteio para gerenciar...').addOptions(activeGiveaways.map(g => ({ label: g.prize.substring(0, 100), value: g.messageId }))));
            components.push(selectMenu);
        }
        const backButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('giveaway_open_panel').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️'));
        components.push(backButton);
        await interaction.editReply({ embeds: [embed], components });
    }
};