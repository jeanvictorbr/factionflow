// src/components/selects/embed_select_channel.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'embed_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        const modal = new ModalBuilder()
            // Passa o ID do canal para o próximo passo
            .setCustomId(`embed_modal_create_${channelId}`)
            .setTitle('Criador de Embeds');
        
        const titleInput = new TextInputBuilder().setCustomId('embed_title').setLabel('Título').setStyle(TextInputStyle.Short).setRequired(true);
        const descInput = new TextInputBuilder().setCustomId('embed_desc').setLabel('Descrição (Suporta Markdown)').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const colorInput = new TextInputBuilder().setCustomId('embed_color').setLabel('Cor (Hexadecimal)').setStyle(TextInputStyle.Short).setPlaceholder('#2b2d31').setRequired(false);
        const imageInput = new TextInputBuilder().setCustomId('embed_image').setLabel('URL da Imagem Principal (Opcional)').setStyle(TextInputStyle.Short).setRequired(false);
        const thumbInput = new TextInputBuilder().setCustomId('embed_thumb').setLabel('URL da Thumbnail (Opcional)').setStyle(TextInputStyle.Short).setRequired(false);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput), new ActionRowBuilder().addComponents(imageInput),
            new ActionRowBuilder().addComponents(thumbInput)
        );
        await interaction.showModal(modal);
    }
};