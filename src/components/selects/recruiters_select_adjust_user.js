// src/components/selects/recruiters_select_adjust_user.js
const { UserSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'recruiters_select_adjust_user',
    async execute(interaction) {
        const userId = interaction.values[0];
        const lastRecruitment = await prisma.application.findFirst({
            where: { recruiterId: userId, status: 'APPROVED' },
            orderBy: { createdAt: 'desc' }
        });
        if (!lastRecruitment) {
            return interaction.update({ content: 'Este usuário não possui nenhum recrutamento aprovado para remover.', components: [] });
        }
        await prisma.application.delete({ where: { id: lastRecruitment.id } });
        await interaction.update({ content: `✅ O último recrutamento de <@${userId}> (ID: ${lastRecruitment.id}) foi removido da contagem.`, components: [] });
    }
};