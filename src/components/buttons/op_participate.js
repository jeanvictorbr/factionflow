// src/components/buttons/op_participate.js
const prisma = require('../../prisma/client');
const { updateOperationEmbed } = require('../../utils/operationEmbedUpdater');

module.exports = {
    customId: 'op_participate',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const operationId = interaction.customId.split('_')[2];
        const userId = interaction.user.id;

        const operation = await prisma.operation.findUnique({
            where: { id: operationId },
            include: { participants: true },
        });

        const isAlreadyParticipant = operation.participants.some(p => p.userId === userId);
        if (isAlreadyParticipant) {
            return interaction.editReply('Você já está inscrito nesta operação.');
        }

        const confirmedCount = operation.participants.filter(p => p.status === 'CONFIRMADO').length;
        const status = confirmedCount < operation.maxParticipants ? 'CONFIRMADO' : 'RESERVA';

        await prisma.participant.create({
            data: { operationId, userId, status }
        });

        await updateOperationEmbed(interaction.client, operationId);
        await interaction.editReply(`Sua inscrição como **${status}** foi confirmada!`);
    }
};