// src/components/buttons/justica_config_panel.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_config_panel',
    async execute(interaction) {
        await interaction.deferUpdate();
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const logChannel = config?.punishmentLogChannelId ? `<#${config.punishmentLogChannelId}>` : '`Não definido`';

        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('⚙️ Configurações do Módulo de Justiça')
            .addFields({ name: 'Canal de Logs', value: `Registros de punições enviados para: ${logChannel}` });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('justica_set_log_channel').setLabel('Definir Canal de Logs').setStyle(ButtonStyle.Secondary).setEmoji('📢'),
                new ButtonBuilder().setCustomId('justica_manage_rules').setLabel('Gerenciar Código Penal').setStyle(ButtonStyle.Primary).setEmoji('📜'), // <-- NOVO BOTÃO
                new ButtonBuilder().setCustomId('justica_open_panel').setLabel('Voltar').setStyle(ButtonStyle.Danger).setEmoji('⬅️')
            );
        
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};