// src/components/buttons/justice_lookup_by_id.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'justice_lookup_by_id',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('justice_modal_lookup_id').setTitle('Consultar por ID');
        const idInput = new TextInputBuilder().setCustomId('lookup_user_id').setLabel('ID do Usuário do Discord').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(idInput));
        await interaction.showModal(modal);
    }
};