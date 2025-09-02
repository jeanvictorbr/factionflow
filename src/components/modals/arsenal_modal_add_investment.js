// src/components/modals/arsenal_modal_add_investment.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_modal_add_investment',
    async execute(interaction) {
        const amount = parseInt(interaction.fields.getTextInputValue('inv_amount'));
        const description = interaction.fields.getTextInputValue('inv_desc');
        if (isNaN(amount)) return interaction.reply({ content: '❌ Valor inválido.', ephemeral: true });
        await prisma.investment.create({ data: { guildId: interaction.guild.id, amount, description } });
        await interaction.reply({ content: `✅ Investimento de **$ ${amount.toLocaleString('pt-BR')}** registrado com sucesso!`, ephemeral: true });
    }
};