// src/components/buttons/embed_action_edit_preview.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'embed_edit_preview',
    async execute(interaction) {
        // Pega os dados escondidos no rodapé da embed
        const footerText = interaction.message.embeds[0]?.footer?.text;
        if (!footerText || !footerText.startsWith('Data:')) {
            return interaction.reply({ content: '❌ Erro: Não foi possível encontrar os dados da pré-visualização para editar.', ephemeral: true });
        }
        const encodedData = footerText.split(':')[1];
        const data = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

        // Cria o mesmo modal de antes
        const modal = new ModalBuilder().setCustomId('embed_modal_create').setTitle('Editor de Embeds');
        
        // Pré-preenche os campos com os dados que a gente recuperou
        const titleInput = new TextInputBuilder().setCustomId('embed_title').setLabel('Título').setStyle(TextInputStyle.Short).setValue(data.t);
        const descInput = new TextInputBuilder().setCustomId('embed_desc').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setValue(data.d);
        const colorInput = new TextInputBuilder().setCustomId('embed_color').setLabel('Cor (Hexadecimal)').setStyle(TextInputStyle.Short).setValue(data.c).setRequired(false);
        const imageInput = new TextInputBuilder().setCustomId('embed_image').setLabel('URL da Imagem Principal').setStyle(TextInputStyle.Short).setValue(data.i || '').setRequired(false);
        const thumbInput = new TextInputBuilder().setCustomId('embed_thumb').setLabel('URL da Thumbnail').setStyle(TextInputStyle.Short).setValue(data.th || '').setRequired(false);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(imageInput),
            new ActionRowBuilder().addComponents(thumbInput)
        );
        
        // Mostra o formulário preenchido para o admin
        await interaction.showModal(modal);
    }
};