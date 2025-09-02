// src/components/buttons/registro_action_show_modal.js
const { ButtonInteraction } = require('discord.js');
// Reutilizamos a lógica que já tínhamos para criar e mostrar o modal.
const modalHandler = require('./registro_config_embed'); // Aponta para o arquivo que modificamos

module.exports = {
    customId: 'registro_action_show_modal',
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        // Encontra o handler original que agora está no arquivo 'registro_config_embed'
        // e executa a lógica de exibir o modal, que é uma função separada que vamos criar
        const { showConfigModal } = require('./registro_config_embed');
        await showConfigModal(interaction);
    }
};