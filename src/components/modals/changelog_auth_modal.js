// src/components/modals/changelog_auth_modal.js
const changelogDashboard = require('../buttons/changelog_view_main');
module.exports = {
    customId: 'changelog_auth_modal',
    async execute(interaction) {
        const password = interaction.fields.getTextInputValue('cl_password');
        if (password === process.env.CHANGELOG_PASSWORD) {
            // DeferUpdate é necessário aqui porque a interação já foi respondida com o modal
            await interaction.deferUpdate();
            await changelogDashboard.execute(interaction, true); // Chama o painel no modo "destravado"
        } else {
            await interaction.reply({ content: '❌ Senha incorreta. Acesso negado.', ephemeral: true });
        }
    }
};