// src/components/buttons/ops_action_schedule.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'ops_action_schedule',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('ops_modal_schedule')
            .setTitle('Agendar Nova Operação');

        const titleInput = new TextInputBuilder()
            .setCustomId('op_title')
            .setLabel('Título da Operação')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: Assalto ao Banco Central')
            .setRequired(true);
        
        const descInput = new TextInputBuilder()
            .setCustomId('op_desc')
            .setLabel('Descrição / Briefing da Missão')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Descreva os objetivos, regras e ponto de encontro.')
            .setRequired(true);

        const datetimeInput = new TextInputBuilder()
            .setCustomId('op_datetime')
            .setLabel('Data e Hora (AAAA-MM-DD HH:MM)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 2025-08-10 21:00')
            .setRequired(true);

        const maxInput = new TextInputBuilder()
            .setCustomId('op_max')
            .setLabel('Máximo de Participantes (Número)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 8')
            .setRequired(true);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(datetimeInput),
            new ActionRowBuilder().addComponents(maxInput)
        );

        await interaction.showModal(modal);
    }
};