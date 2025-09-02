// src/components/buttons/view_module_sentinel.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_sentinel',
    async execute(interaction) {
        await interaction.deferUpdate();
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const status = config?.reportEnabled ? '`🟢 ATIVADO`' : '`🔴 DESATIVADO`';
        const channel = config?.reportChannelId ? `<#${config.reportChannelId}>` : '`⚠️ Não Definido`';
        
        // Formata o agendamento de forma legível
        const schedule = (config?.reportDayOfWeek !== null && config?.reportTime) 
            ? `\`Toda ${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][config.reportDayOfWeek]} às ${config.reportTime}\``
            : '`⚠️ Não Definido`';

        const embed = new EmbedBuilder()
            .setColor(config?.reportEnabled ? '#2ecc71' : '#e74c3c')
            .setTitle('📡 Módulo Sentinela - Relatórios Automáticos')
            .setImage('https://i.imgur.com/Kn1md4m.gif')
            .setDescription('Configure o sistema para receber relatórios de performance semanais automaticamente no canal e horário definidos.')
            .addFields(
                { name: 'Status Atual', value: status, inline: true },
                { name: 'Canal de Destino', value: channel, inline: true },
                { name: 'Agendamento', value: schedule, inline: false }
            );

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('sentinel_toggle_status')
                .setLabel(config?.reportEnabled ? 'Desativar' : 'Ativar')
                .setStyle(config?.reportEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('sentinel_set_channel')
                .setLabel('Definir Canal')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📺'),
            new ButtonBuilder()
                .setCustomId('sentinel_set_schedule')
                .setLabel('Definir Horário')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏰'),
            new ButtonBuilder()
                .setCustomId('sentinel_preview_report')
                .setLabel('Ver Prévia')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📄')
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
               .setCustomId('rpainel_view_registros')
               .setLabel('Voltar para Módulos')
               .setStyle(ButtonStyle.Secondary)
               .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [row1, row2] });
    }
};