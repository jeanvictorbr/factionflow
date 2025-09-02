// src/components/selects/justice_select_type.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'justice_select_type',
    async execute(interaction) {
        const targetUserId = interaction.customId.split('_')[3];
        const punishmentType = interaction.values[0]; // Ex: 'Advertência_1'
        
        const typeLabel = `Advertência (ADV ${punishmentType.split('_')[1]})`;
        const modal = new ModalBuilder()
            .setCustomId(`justice_modal_punish_${targetUserId}_${punishmentType}`)
            .setTitle(`Sentença: ${typeLabel}`);
            
        const reasonInput = new TextInputBuilder().setCustomId('punish_reason').setLabel('Motivo / Descrição da Infração').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const durationInput = new TextInputBuilder().setCustomId('punish_duration').setLabel('Duração da Sentença (em DIAS)').setStyle(TextInputStyle.Short).setPlaceholder('Digite 0 para ser permanente.').setRequired(true);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(reasonInput),
            new ActionRowBuilder().addComponents(durationInput)
        );
        await interaction.showModal(modal);
    }
};