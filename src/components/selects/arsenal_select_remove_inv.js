// src/components/selects/arsenal_select_remove_inv.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_select_remove_inv',
    async execute(interaction) {
        const investmentId = interaction.values[0];
        try {
            const deleted = await prisma.investment.delete({ where: { id: investmentId }});
            await interaction.update({ content: `✅ Investimento de **$${deleted.amount.toLocaleString('pt-BR')}** ("${deleted.description}") foi apagado.`, components: [] });
        } catch (error) {
            await interaction.update({ content: '❌ Erro ao apagar. O investimento pode já ter sido removido.', components: [] });
        }
    }
};