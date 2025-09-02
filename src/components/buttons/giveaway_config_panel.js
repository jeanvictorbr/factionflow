const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_config_panel',
    async execute(interaction) {
        await interaction.deferUpdate();
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        
        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('⚙️ Configurações do Módulo de Sorteios')
            .setDescription('Personalize todos os aspectos do sistema de sorteios.')
            .addFields(
                { name: '📢 Canal de Logs', value: config?.giveawayLogChannelId ? `<#${config.giveawayLogChannelId}>` : '`Não definido`' },
                { name: '👤 Cargo Padrão', value: config?.giveawayDefaultRoleId ? `<@&${config.giveawayDefaultRoleId}>` : '`Nenhum`' },
                { name: '🎨 Cores', value: 'Defina as cores das embeds para cada estado do sorteio.'},
                { name: '🖼️ Imagens', value: 'Defina imagens padrão para as embeds de sorteio.' }
            );

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('giveaway_set_log_channel').setLabel('Definir Logs').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('giveaway_set_default_role').setLabel('Definir Cargo Padrão').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('giveaway_config_colors').setLabel('Personalizar Cores').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('giveaway_set_default_images').setLabel('Definir Imagens').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('giveaway_open_panel').setLabel('Voltar').setStyle(ButtonStyle.Danger)
        );
        
        await interaction.editReply({ embeds: [embed], components: [buttons] });
    }
};