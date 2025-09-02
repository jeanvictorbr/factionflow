// src/components/buttons/justica_delete_record_start.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_delete_record_start',
    async execute(interaction) {
        const targetUserId = interaction.customId.split('_').pop();
        const modal = new ModalBuilder()
            .setCustomId(`justica_delete_record_modal_${targetUserId}`)
            .setTitle('Excluir Registro de Punição');
        
        const caseIdInput = new TextInputBuilder().setCustomId('p_case_id').setLabel('ID do Caso a ser Excluído').setPlaceholder('Ex: 103').setStyle(TextInputStyle.Short).setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(caseIdInput));
        await interaction.showModal(modal);
    }
};