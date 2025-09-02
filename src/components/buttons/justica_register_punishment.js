const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_register_punishment',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('justica_register_punishment_modal')
            .setTitle('Registrar Nova Punição');

        const userIdInput = new TextInputBuilder().setCustomId('p_user_id').setLabel('ID do Discord do Infrator').setStyle(TextInputStyle.Short).setRequired(true);
        const ruleCodeInput = new TextInputBuilder().setCustomId('p_rule_code').setLabel('Código da Regra (Ex: 1.1-RDM)').setStyle(TextInputStyle.Short).setRequired(true);
        const reasonInput = new TextInputBuilder().setCustomId('p_reason').setLabel('Detalhes/Motivo da Punição').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const proofInput = new TextInputBuilder().setCustomId('p_proof').setLabel('Link da Prova (Opcional)').setStyle(TextInputStyle.Short).setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(userIdInput),
            new ActionRowBuilder().addComponents(ruleCodeInput),
            new ActionRowBuilder().addComponents(reasonInput),
            new ActionRowBuilder().addComponents(proofInput)
        );
        await interaction.showModal(modal);
    }
};