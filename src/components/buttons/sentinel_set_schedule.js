// src/components/buttons/sentinel_set_schedule.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'sentinel_set_schedule',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('sentinel_modal_schedule')
            .setTitle('Agendar Relatório Semanal');

        const dayInput = new TextInputBuilder()
            .setCustomId('report_day')
            .setLabel('Dia da Semana (Número de 0 a 6)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, ...')
            .setRequired(true);

        const timeInput = new TextInputBuilder()
            .setCustomId('report_time')
            .setLabel('Hora do Relatório (Formato 24h: HH:MM)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 22:00 para 10 da noite')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(dayInput),
            new ActionRowBuilder().addComponents(timeInput)
        );
        
        await interaction.showModal(modal);
    }
};