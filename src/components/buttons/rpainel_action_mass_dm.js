// src/components/buttons/rpainel_action_mass_dm.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'rpainel_action_mass_dm',
    async execute(interaction) {
        
        const modal = new ModalBuilder()
            .setCustomId('mass_dm_modal_submit')
            .setTitle('Enviar Mensagem em Massa');

        const messageInput = new TextInputBuilder()
            .setCustomId('dm_message_content')
            .setLabel("Mensagem que será enviada para todos")
            .setStyle(TextInputStyle.Paragraph)
            // TEXTO DO PLACEHOLDER CORRIGIDO (MENOR QUE 100 CARACTERES)
            .setPlaceholder('Digite a mensagem para todos os membros aqui. Esta ação é imediata.')
            .setRequired(true);
        
        const actionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};