// src/components/buttons/partnerships_action_edit.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'partnerships_action_edit',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const partners = await prisma.partnership.findMany({ where: { guildId: interaction.guild.id }, take: 25 });
        if (partners.length === 0) return interaction.editReply('Não há parceiros para editar.');

        const selectMenu = new StringSelectMenuBuilder().setCustomId('partnerships_select_edit').setPlaceholder('Selecione o parceiro para editar').addOptions(
            partners.map(p => new StringSelectMenuOptionBuilder().setLabel(p.name).setValue(p.id))
        );
        await interaction.editReply({ content: 'Selecione um parceiro para alterar seus detalhes.', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};