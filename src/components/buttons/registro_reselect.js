// src/components/buttons/registro_reselect.js
const { ButtonInteraction } = require('discord.js');
const { displayRecruiterPage } = require('../../utils/recruiterPaginator');

module.exports = {
    customId: 'registro_reselect',
    async execute(interaction) {
        const applicationId = interaction.customId.split('_')[2];
        if (!applicationId) {
            return interaction.update({ content: '❌ Erro ao encontrar o ID da sua aplicação.', components: [], embeds: [] });
        }
        // Chama a função para mostrar a primeira página da lista de recrutadores
        // O interaction.update() já é feito dentro da função displayRecruiterPage
        await displayRecruiterPage(interaction, applicationId, 0);
    }
};