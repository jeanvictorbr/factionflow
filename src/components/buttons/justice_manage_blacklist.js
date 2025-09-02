// src/components/buttons/justice_manage_blacklist.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'justice_manage_blacklist',
    async execute(interaction) {
        await interaction.deferUpdate();
        const count = await prisma.blacklist.count({ where: { guildId: interaction.guild.id } });
        const embed = new EmbedBuilder().setColor('#000000').setTitle('🚫 Painel da Blacklist').setDescription(`Atualmente, existem **${count}** indivíduos na lista negra.\nMembros na blacklist são **automaticamente expulsos** ao tentar entrar no servidor.`);
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('blacklist_action_add').setLabel('Adicionar').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('blacklist_action_remove').setLabel('Remover').setStyle(ButtonStyle.Danger).setEmoji('➖'),
            new ButtonBuilder().setCustomId('view_module_justice').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
        );
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};