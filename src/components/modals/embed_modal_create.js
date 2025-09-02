// src/components/modals/embed_modal_create.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'embed_modal_create',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Pega o ID do canal que foi passado no customId do modal
            const channelId = interaction.customId.split('_')[3];
            if (!channelId) {
                return interaction.editReply({ content: '❌ Erro: O canal de destino não foi encontrado. Tente novamente.' });
            }

            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_desc');
            let color = interaction.fields.getTextInputValue('embed_color') || '#2b2d31';
            const imageUrl = interaction.fields.getTextInputValue('embed_image') || null;
            const thumbUrl = interaction.fields.getTextInputValue('embed_thumb') || null;
            
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                color = '#2b2d31';
            }

            const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
            if (imageUrl) embed.setImage(imageUrl);
            if (thumbUrl) embed.setThumbnail(thumbUrl);

            // Codifica todos os dados, incluindo o canal de destino, para passar para os botões
            const data = { ch: channelId, t: title, d: description, c: color, i: imageUrl, th: thumbUrl };
            const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');

            embed.setFooter({ text: `Data:${encodedData}` });

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('embed_publish').setLabel('Publicar Embed').setStyle(ButtonStyle.Success).setEmoji('✅'),
                new ButtonBuilder().setCustomId('embed_edit_preview').setLabel('Editar').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
                new ButtonBuilder().setCustomId('cancel_action').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
            );
            
            await interaction.editReply({ content: '**Pré-visualização da sua Embed:**', embeds: [embed], components: [buttons] });

        } catch (error) {
            console.error("Erro ao criar pré-visualização da embed:", error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao gerar a pré-visualização.' });
        }
    }
};