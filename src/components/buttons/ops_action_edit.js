// src/components/buttons/ops_action_edit.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'ops_action_edit',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const operations = await prisma.operation.findMany({ where: { guildId: interaction.guild.id, status: { in: ['AGENDADA', 'EM ANDAMENTO'] } }, take: 25 });
        if (operations.length === 0) return interaction.editReply({ content: 'Não há operações ativas ou agendadas para editar.' });
        const selectMenu = new StringSelectMenuBuilder().setCustomId('ops_select_edit').setPlaceholder('Selecione a operação que deseja editar').addOptions(
            operations.map(op => new StringSelectMenuOptionBuilder().setLabel(op.title.slice(0,100)).setValue(op.id))
        );
        await interaction.editReply({ content: 'Selecione uma operação para alterar seus detalhes.', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};