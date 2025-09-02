// src/components/buttons/giveaway_end.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_end',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const messageId = interaction.customId.split('_').pop();
        await prisma.giveaway.update({ where: { messageId }, data: { endsAt: new Date() } }); // Força o término
        await interaction.editReply('✅ Sorteio marcado para encerramento no próximo ciclo de verificação (em até 15 segundos).');
    }
};