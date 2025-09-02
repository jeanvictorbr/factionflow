// src/components/selects/justica_confirm_role_for_rule.js
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_confirm_role_for_rule', // Será lido com startsWith
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Extrai o ID da regra do ID do menu
        const ruleId = interaction.customId.split('_').pop();
        // Pega o ID do cargo que o usuário selecionou
        const selectedRoleId = interaction.values[0];

        try {
            // Atualiza a regra no banco de dados, salvando o ID do cargo temporário
            await prisma.rule.update({
                where: { id: ruleId },
                data: {
                    temporaryRoleId: selectedRoleId
                }
            });

            await interaction.editReply({
                content: `✅ O cargo <@&${selectedRoleId}> foi definido com sucesso para esta regra! Quando a regra for aplicada, este cargo será adicionado ao infrator.`
            });

        } catch (error) {
            console.error("Erro ao definir cargo temporário para regra:", error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao tentar salvar o cargo no banco de dados.' });
        }
    }
};