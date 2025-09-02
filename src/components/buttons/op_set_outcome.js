// src/components/buttons/op_set_outcome.js
const prisma = require('../../prisma/client');
const { updateOperationEmbed } = require('../../utils/operationEmbedUpdater');

module.exports = {
    customId: 'op_set_outcome',
    async execute(interaction) {
        await interaction.deferUpdate();
        const parts = interaction.customId.split('_');
        const outcome = parts[3];
        const operationId = parts[4];

        let outcomeText = 'Sem resultado';
        if (outcome === 'vencemos') outcomeText = 'VENCEMOS';
        if (outcome === 'perdemos') outcomeText = 'PERDEMOS';

        await prisma.operation.update({
            where: { id: operationId },
            data: { 
                status: 'CONCLUÍDA',
                outcome: outcomeText,
            }
        });

        await updateOperationEmbed(interaction.client, operationId);
        // Remove a mensagem de seleção de resultado
        await interaction.deleteReply(); 
    }
};