// src/components/modals/sentinel_modal_schedule.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'sentinel_modal_schedule',
    async execute(interaction) {
        const dayOfWeekStr = interaction.fields.getTextInputValue('report_day');
        const time = interaction.fields.getTextInputValue('report_time');
        const dayOfWeek = parseInt(dayOfWeekStr);

        // Validação dos dados
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
            return interaction.reply({ content: '❌ Dia da semana inválido. Por favor, insira um número de 0 (Domingo) a 6 (Sábado).', ephemeral: true });
        }
        if (!timeRegex.test(time)) {
            return interaction.reply({ content: '❌ Formato de hora inválido. Por favor, use o formato HH:MM (ex: 22:00).', ephemeral: true });
        }

        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { reportDayOfWeek: dayOfWeek, reportTime: time },
            create: { guildId: interaction.guild.id, reportDayOfWeek: dayOfWeek, reportTime: time },
        });

        await interaction.reply({
            content: `✅ Agendamento do relatório atualizado com sucesso!`,
            ephemeral: true
        });
    }
};