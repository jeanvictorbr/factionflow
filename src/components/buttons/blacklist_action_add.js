// src/components/buttons/blacklist_action_add.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'blacklist_action_add',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('blacklist_modal_add')
            .setTitle('Adicionar à Blacklist');

        const userIdInput = new TextInputBuilder()
            .setCustomId('bl_userid')
            .setLabel('ID do Usuário do Discord')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Cole aqui o ID do usuário a ser banido')
            .setRequired(true);

        const reasonInput = new TextInputBuilder()
            .setCustomId('bl_reason')
            .setLabel('Motivo da Inclusão na Blacklist')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Ex: Anti-RP grave, traição, etc.')
            .setRequired(true);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(userIdInput),
            new ActionRowBuilder().addComponents(reasonInput)
        );

        await interaction.showModal(modal);
    }
};