// src/components/buttons/changelog_action_edit.js
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'changelog_action_edit',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const entries = await prisma.changelogEntry.findMany({ where: { guildId: interaction.guild.id }, orderBy: { createdAt: 'desc' }, take: 25 });
        if (entries.length === 0) return interaction.editReply('Não há entradas para editar.');
        const selectMenu = new StringSelectMenuBuilder().setCustomId('changelog_select_edit').setPlaceholder('Selecione uma entrada para editar').addOptions(
            entries.map(e => ({ label: `(${e.version}) ${e.title.slice(0, 80)}`, value: e.id }))
        );
        await interaction.editReply({ content: 'Selecione a entrada do changelog que deseja alterar:', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};