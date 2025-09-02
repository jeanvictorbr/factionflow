// src/components/modals/embed_modal_edit_submit.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'embed_modal_edit_submit',
    async execute(interaction) {
        await interaction.deferUpdate();
        const messageId = interaction.customId.split('_')[4];

        // Pega os novos dados do formulário
        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_desc');
        let color = interaction.fields.getTextInputValue('embed_color');
        const imageUrl = interaction.fields.getTextInputValue('embed_image');
        const thumbUrl = interaction.fields.getTextInputValue('embed_thumb');
        if (!/^#[0-9A-F]{6}$/i.test(color)) color = '#2b2d31';

        // Recria a embed com as novas informações
        const newEmbed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
        if (imageUrl) newEmbed.setImage(imageUrl);
        if (thumbUrl) newEmbed.setThumbnail(thumbUrl);
        
        // Encontra a mensagem original e a edita
        await interaction.channel.messages.edit(messageId, { embeds: [newEmbed] });

        // Confirma para o admin que a edição foi um sucesso
        await interaction.followUp({ content: '✅ Embed atualizada com sucesso!', ephemeral: true });
    }
};