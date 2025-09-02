// src/components/modals/arsenal_modal_reset_inv.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_modal_reset_inv',
    async execute(interaction) {
        if (interaction.fields.getTextInputValue('confirm_text') !== 'RESETAR INVESTIMENTOS') {
            return interaction.reply({ content: 'Confirmação incorreta. Operação cancelada.', ephemeral: true });
        }
        await prisma.investment.deleteMany({ where: { guildId: interaction.guild.id } });
        await interaction.reply({ content: '✅ Todos os registros de investimentos foram permanentemente apagados.', ephemeral: true });
    }
};