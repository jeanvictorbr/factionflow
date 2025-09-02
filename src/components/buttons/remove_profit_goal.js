// src/components/buttons/set_profit_goal.js
const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    customId: 'set_profit_goal',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('set_profit_goal_modal')
            .setTitle('🎯 Definir Meta de Lucro');

        const goalInput = new TextInputBuilder()
            .setCustomId('profit_goal_input')
            .setLabel('Valor da Meta (apenas números)')
            .setPlaceholder('Ex: 1000000 para $1.000.000')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(goalInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
};