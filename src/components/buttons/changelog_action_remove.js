// src/components/buttons/changelog_action_remove.js
// A lógica é quase idêntica ao de editar, apenas muda o customId do menu
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'changelog_action_remove',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const entries = await prisma.changelogEntry.findMany({ where: { guildId: interaction.guild.id }, orderBy: { createdAt: 'desc' }, take: 25 });
        if (entries.length === 0) return interaction.editReply('Não há entradas para remover.');
        const selectMenu = new StringSelectMenuBuilder().setCustomId('changelog_select_remove').setPlaceholder('Selecione uma entrada para remover').addOptions(
            entries.map(e => ({ label: `(${e.version}) ${e.title.slice(0, 80)}`, value: e.id }))
        );
        await interaction.editReply({ content: '**ATENÇÃO:** A remoção é permanente. Selecione a entrada que deseja apagar:', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};