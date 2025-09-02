// src/components/buttons/hierarquia_config_channel.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');

module.exports = {
    customId: 'hierarquia_config_channel',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📺 Definição de Canal')
            .setDescription('Selecione no menu abaixo o canal onde a embed da hierarquia será postada e atualizada.');
        
        const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('hierarquia_select_channel')
                .setPlaceholder('Escolha o canal para a hierarquia')
                .addChannelTypes(ChannelType.GuildText)
        );

        await interaction.reply({
            embeds: [embed],
            components: [selectMenu],
            ephemeral: true,
        });
    }
};