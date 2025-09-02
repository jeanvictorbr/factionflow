// src/components/buttons/sentinel_preview_report.js
const { generateAndSendWeeklyReport } = require('../../tasks/reportGenerator');

module.exports = {
    customId: 'sentinel_preview_report',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Chama a função do cérebro com o parâmetro "isPreview" como true
        const reportEmbed = await generateAndSendWeeklyReport(interaction.guild, interaction.client, true);

        if (!reportEmbed) {
            return interaction.editReply({ content: 'Não foi possível gerar a prévia. Verifique as configurações.' });
        }
        
        await interaction.editReply({ content: 'Esta é uma prévia do relatório do Sentinela, buscando dados de um período maior para garantir que as informações apareçam:', embeds: [reportEmbed] });
    }
};