// src/components/buttons/prune_action_start_scan.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'prune_action_start_scan',
    async execute(interaction) {
        // A lógica de resposta a um clique de botão que abre um modal é direta.
        // Não precisamos de "defer", pois o "showModal" já é uma resposta.
        // O código anterior provavelmente tinha uma falha que foi corrigida aqui.

        const modal = new ModalBuilder()
            .setCustomId('prune_modal_start_scan')
            .setTitle('Iniciar Varredura de Inativos');
            
        const daysInput = new TextInputBuilder()
            .setCustomId('prune_days')
            .setLabel('Inativos há quantos dias?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 30 (verifica quem não manda msg há 30 dias)')
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(daysInput));

        // A resposta para a interação do botão é mostrar o modal.
        await interaction.showModal(modal);
    }
};