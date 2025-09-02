// src/components/buttons/changelog_auth.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'changelog_auth',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('changelog_auth_modal').setTitle('Acesso ao Módulo de Changelog');
        const passwordInput = new TextInputBuilder().setCustomId('cl_password').setLabel('Senha de Acesso').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(passwordInput));
        await interaction.showModal(modal);
    }
};