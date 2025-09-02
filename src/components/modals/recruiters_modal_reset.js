// src/components/modals/recruiters_modal_reset.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'recruiters_modal_reset',
    async execute(interaction) {
        const confirmText = interaction.fields.getTextInputValue('confirm_text');
        if (confirmText !== 'RESETAR TUDO') {
            return interaction.reply({ content: 'Confirmação incorreta. A operação foi cancelada.', ephemeral: true });
        }

        await prisma.application.deleteMany({
            where: { guildId: interaction.guild.id, status: 'APPROVED' }
        });
        
        await interaction.reply({ content: '✅ O ranking de recrutadores foi zerado com sucesso.', ephemeral: true });
    }
};