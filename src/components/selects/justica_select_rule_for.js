// src/components/selects/justica_select_rule_for.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_select_rule_for', // Usaremos startsWith para pegar a parte dinâmica
    async execute(interaction) {
        const targetUserId = interaction.customId.split('_').pop(); // Extrai o ID do usuário do customId
        const ruleId = interaction.values[0]; // ID da regra selecionada

        const modal = new ModalBuilder()
            .setCustomId(`justica_final_modal_${targetUserId}_${ruleId}`) // Passa os dois IDs
            .setTitle('Finalizar Registro de Punição');
        
        const reasonInput = new TextInputBuilder().setCustomId('p_reason').setLabel('Detalhes/Motivo da Punição').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const proofInput = new TextInputBuilder().setCustomId('p_proof').setLabel('Link da Prova (Opcional)').setStyle(TextInputStyle.Short).setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(reasonInput),
            new ActionRowBuilder().addComponents(proofInput)
        );

        await interaction.showModal(modal);
    }
};