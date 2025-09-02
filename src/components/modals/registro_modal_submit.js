// src/components/modals/registro_modal_submit.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
const { displayRecruiterPage } = require('../../utils/recruiterPaginator');

module.exports = {
    customId: 'registro_modal_submit',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // --- DIAGNÓSTICO DE COLETA DE DADOS ---
        console.log('\n--- INÍCIO DO DIAGNÓSTICO DE COLETA ---');
        const rpName = interaction.fields.getTextInputValue('registro_rp_name');
        const gameId = interaction.fields.getTextInputValue('registro_game_id');
        console.log(`[COLETA] Nome RP lido do formulário: [${rpName}]`);
        console.log(`[COLETA] ID do Jogo lido do formulário: [${gameId}]`);

        // Anti-Flood
        const existingApplication = await prisma.application.findFirst({ where: { userId: interaction.user.id, guildId: interaction.guild.id, NOT: { status: { in: ['APPROVED', 'REJECTED'] } } } });
        if (existingApplication) {
            return interaction.editReply({ content: 'Você já tem uma solicitação em análise.' });
        }

        console.log('[COLETA] Tentando salvar os dados lidos no banco de dados...');
        const application = await prisma.application.create({
            data: {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                rpName: rpName,
                gameId: gameId,
                status: 'SELECTING_RECRUITER',
            },
        });
        console.log(`[COLETA] DADOS SALVOS! ID da nova aplicação: ${application.id}`);
        console.log('--- FIM DO DIAGNÓSTICO DE COLETA ---\n');

        await displayRecruiterPage(interaction, application.id, 0);
    },
};