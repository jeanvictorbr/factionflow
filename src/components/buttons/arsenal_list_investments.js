// src/components/buttons/arsenal_list_investments.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_list_investments',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const investments = await prisma.investment.findMany({ where: { guildId: interaction.guild.id }, orderBy: { createdAt: 'desc' }});
        if (investments.length === 0) return interaction.editReply('Nenhum investimento registrado.');
        const list = investments.map(inv => `**$${inv.amount.toLocaleString('pt-BR')}** - ${inv.description} (<t:${Math.floor(inv.createdAt.getTime()/1000)}:R>)`).join('\n');
        const embed = new EmbedBuilder().setColor('#2ecc71').setTitle('📋 Lista de Investimentos').setDescription(list);
        await interaction.editReply({ embeds: [embed] });
    }
};