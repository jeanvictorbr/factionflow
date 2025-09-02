// src/components/buttons/registro_config_canais.js
const { EmbedBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

// Esta é a nossa "fábrica" de painel. Ela só se preocupa em montar a aparência.
async function buildConfigCanaisPanel(interaction) {
    const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

    const interactionChannel = config?.interactionChannelId ? `<#${config.interactionChannelId}>` : '`[ ✖️ NÃO DEFINIDO ]`';
    const logsChannel = config?.logsChannelId ? `<#${config.logsChannelId}>` : '`[ ✖️ NÃO DEFINIDO ]`';

    const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle('[ 📺 CONFIGURAÇÃO DE CANAIS ]')
        .setDescription('Direcione o fluxo de novas aplicações para os canais corretos.')
        .setThumbnail('https://i.imgur.com/5zM1pLe.gif')
        .addFields(
            { name: '🛰️ Canal de Interação', value: `> ${interactionChannel}` },
            { name: '🖥️ Canal de Logs/Análise', value: `> ${logsChannel}` }
        )
        .setFooter({ text: 'As alterações são salvas automaticamente.' });

    const interactionChannelMenu = new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder().setCustomId('registro_select_interaction_channel').setPlaceholder('SELECIONE O CANAL DE INTERAÇÃO').addChannelTypes(ChannelType.GuildText)
    );
    const logsChannelMenu = new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder().setCustomId('registro_select_logs_channel').setPlaceholder('SELECIONE O CANAL DE LOGS').addChannelTypes(ChannelType.GuildText)
    );
    const backButtonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_module_registro').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
    );
    
    return { embeds: [embed], components: [interactionChannelMenu, logsChannelMenu, backButtonRow] };
}

module.exports = {
    customId: 'registro_config_canais',
    buildPanel: buildConfigCanaisPanel, // Exportamos a "fábrica"
    async execute(interaction) {
        // Para o primeiro clique no botão, "update" é o correto.
        const panel = await buildConfigCanaisPanel(interaction);
        await interaction.update(panel);
    }
};