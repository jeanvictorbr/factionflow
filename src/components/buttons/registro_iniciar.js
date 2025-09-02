// src/components/buttons/registro_iniciar.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'registro_iniciar',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('registro_modal_submit').setTitle('Formulário de Registro');
        const rpNameInput = new TextInputBuilder().setCustomId('registro_rp_name').setLabel('Qual seu nome completo no RP?').setStyle(TextInputStyle.Short).setRequired(true);
        const gameIdInput = new TextInputBuilder().setCustomId('registro_game_id').setLabel('Qual seu ID no jogo?').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(rpNameInput), new ActionRowBuilder().addComponents(gameIdInput));
        await interaction.showModal(modal);
    }
};