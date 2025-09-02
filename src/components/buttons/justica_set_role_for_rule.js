// src/components/buttons/justica_set_role_for_rule.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_set_role_for_rule', // Será lido com startsWith
    async execute(interaction) {
        // Extrai o ID da regra que está sendo editada a partir do ID do botão
        const ruleId = interaction.customId.split('_').pop();

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId(`justica_confirm_role_for_rule_${ruleId}`) // Passa o ID da regra para a próxima etapa
                    .setPlaceholder('Selecione o cargo a ser aplicado com esta regra...')
            );

        await interaction.reply({
            content: 'Por favor, selecione o cargo que será aplicado temporariamente quando esta regra for usada.',
            components: [selectMenu],
            ephemeral: true
        });
    }
};