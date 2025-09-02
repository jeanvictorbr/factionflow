// src/components/modals/arsenal_modal_reset_sales.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_modal_reset_sales',
    async execute(interaction) {
        if (interaction.fields.getTextInputValue('confirm_text') !== 'RESETAR VENDAS') {
            return interaction.reply({ content: 'Confirmação incorreta. Operação cancelada.', ephemeral: true });
        }
        await prisma.sale.deleteMany({ where: { guildId: interaction.guild.id } });
        await interaction.reply({ content: '✅ Todos os registros de vendas foram permanentemente apagados.', ephemeral: true });
    }
};