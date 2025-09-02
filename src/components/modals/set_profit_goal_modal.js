// src/components/modals/set_profit_goal_modal.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
const { buildFinancePanel } = require('../buttons/rpainel_view_finances');

module.exports = {
    customId: 'set_profit_goal_modal',
    async execute(interaction) {
        // A interação do modal deve deferir a resposta para evitar o erro "Unknown interaction"
        await interaction.deferUpdate();

        // Pega o valor digitado pelo usuário no campo do modal
        const goal = interaction.fields.getTextInputValue('profit_goal_input');

        const goalValue = parseFloat(goal);
        if (isNaN(goalValue) || goalValue < 0) {
            await interaction.editReply({ content: '❌ O valor da meta deve ser um número válido e positivo.' });
            return;
        }

        try {
            // Salva a meta no banco de dados usando o Prisma
            await prisma.guildConfig.upsert({
                where: { guildId: interaction.guild.id },
                update: { targetProfit: goalValue },
                create: { guildId: interaction.guild.id, targetProfit: goalValue }
            });

            // Constrói o painel de finanças com os dados atualizados
            const updatedPanel = await buildFinancePanel(interaction);
            
            // Edita a mensagem original do painel para mostrar a meta nova
            await interaction.editReply(updatedPanel);
        } catch (error) {
            console.error('Erro ao definir a meta de lucro:', error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao salvar a meta. Tente novamente.' });
        }
    }
};