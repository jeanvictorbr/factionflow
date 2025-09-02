// src/components/buttons/embed_action_edit.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'embed_edit',
    async execute(interaction) {
        // Pega a embed original da mensagem onde o botão foi clicado
        const originalEmbed = interaction.message.embeds[0];
        if (!originalEmbed) {
            return interaction.reply({ content: '❌ Não foi possível encontrar a embed original para editar.', ephemeral: true });
        }

        // Cria o modal e pré-preenche com os dados da embed existente
        const modal = new ModalBuilder()
            .setCustomId(`embed_modal_edit_submit_${interaction.message.id}`) // Passa o ID da mensagem para o próximo passo
            .setTitle('Editor de Embed');

        const titleInput = new TextInputBuilder().setCustomId('embed_title').setLabel('Título').setStyle(TextInputStyle.Short).setValue(originalEmbed.title || '');
        const descInput = new TextInputBuilder().setCustomId('embed_desc').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setValue(originalEmbed.description || '');
        const colorInput = new TextInputBuilder().setCustomId('embed_color').setLabel('Cor (Hexadecimal)').setStyle(TextInputStyle.Short).setValue(originalEmbed.hexColor || '#2b2d31').setRequired(false);
        const imageInput = new TextInputBuilder().setCustomId('embed_image').setLabel('URL da Imagem Principal').setStyle(TextInputStyle.Short).setValue(originalEmbed.image?.url || '').setRequired(false);
        const thumbInput = new TextInputBuilder().setCustomId('embed_thumb').setLabel('URL da Thumbnail').setStyle(TextInputStyle.Short).setValue(originalEmbed.thumbnail?.url || '').setRequired(false);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(imageInput),
            new ActionRowBuilder().addComponents(thumbInput)
        );
        
        await interaction.showModal(modal);
    }
};