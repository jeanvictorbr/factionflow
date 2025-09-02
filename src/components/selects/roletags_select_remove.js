// src/components/selects/roletags_select_remove.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'roletags_select_remove',
    async execute(interaction) {
        const roleIdToRemove = interaction.values[0];
        await prisma.roleTag.delete({ where: { roleId: roleIdToRemove } });
        await interaction.update({ content: `✅ A regra de tag para o cargo foi removida com sucesso! O dashboard será atualizado.`, components: [] });
    }
};