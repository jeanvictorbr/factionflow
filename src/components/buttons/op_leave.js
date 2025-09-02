// src/components/buttons/op_leave.js
const prisma = require('../../prisma/client');
const { updateOperationEmbed } = require('../../utils/operationEmbedUpdater');

module.exports = {
    customId: 'op_leave',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const operationId = interaction.customId.split('_')[2];
        const userId = interaction.user.id;

        try {
            await prisma.participant.delete({
                where: { operationId_userId: { operationId, userId } }
            });
        } catch (error) {
            return interaction.editReply('Você não estava inscrito nesta operação.');
        }

        // Lógica para promover um reserva
        const operation = await prisma.operation.findUnique({
            where: { id: operationId },
            include: { participants: { orderBy: { id: 'asc' } } }, // Pega o reserva mais antigo
        });
        const confirmedCount = operation.participants.filter(p => p.status === 'CONFIRMADO').length;
        if (confirmedCount < operation.maxParticipants) {
            const firstReserve = operation.participants.find(p => p.status === 'RESERVA');
            if (firstReserve) {
                await prisma.participant.update({
                    where: { id: firstReserve.id },
                    data: { status: 'CONFIRMADO' },
                });
            }
        }

        await updateOperationEmbed(interaction.client, operationId);
        await interaction.editReply('Sua inscrição foi removida com sucesso.');
    }
};