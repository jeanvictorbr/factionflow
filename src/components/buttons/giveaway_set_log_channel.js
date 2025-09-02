const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
module.exports = {
    customId: 'giveaway_set_log_channel',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('giveaway_select_log_channel').setPlaceholder('Selecione o canal de logs...').addChannelTypes(ChannelType.GuildText));
        await interaction.reply({ content: 'Selecione o canal onde os logs de sorteios (criação, finalização) serão enviados.', components: [selectMenu], ephemeral: true });
    }
};