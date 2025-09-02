// src/components/buttons/justica_set_log_channel.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'justica_set_log_channel',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('justica_set_log_channel_modal').setTitle('Definir Canal de Logs');
        const channelIdInput = new TextInputBuilder().setCustomId('log_channel_id').setLabel('ID do Canal de Logs').setPlaceholder('Cole o ID do canal de texto aqui').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(channelIdInput));
        await interaction.showModal(modal);
    }
};