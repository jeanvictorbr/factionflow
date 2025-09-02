// src/components/selects/ops_select_edit.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const { format } = require('date-fns');
module.exports = {
    customId: 'ops_select_edit',
    async execute(interaction) {
        const operationId = interaction.values[0];
        const op = await prisma.operation.findUnique({ where: { id: operationId } });
        if (!op) return interaction.update({ content: 'Operação não encontrada.', components: [] });

        const modal = new ModalBuilder().setCustomId(`ops_modal_schedule_${operationId}`).setTitle(`Editando: ${op.title}`); // Adicionamos o ID para o handler saber que é edição
        const titleInput = new TextInputBuilder().setCustomId('op_title').setLabel('Título').setStyle(TextInputStyle.Short).setValue(op.title);
        const descInput = new TextInputBuilder().setCustomId('op_desc').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setValue(op.description);
        const datetimeInput = new TextInputBuilder().setCustomId('op_datetime').setLabel('Data e Hora (AAAA-MM-DD HH:MM)').setStyle(TextInputStyle.Short).setValue(format(op.scheduledAt, 'yyyy-MM-dd HH:mm'));
        const maxInput = new TextInputBuilder().setCustomId('op_max').setLabel('Máximo de Participantes').setStyle(TextInputStyle.Short).setValue(op.maxParticipants.toString());
        
        modal.addComponents(new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(descInput), new ActionRowBuilder().addComponents(datetimeInput), new ActionRowBuilder().addComponents(maxInput));
        await interaction.showModal(modal);
    }
};