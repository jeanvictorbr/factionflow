// src/components/buttons/partnerships_action_add.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'partnerships_action_add',
    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId('partnerships_modal_submit').setTitle('Adicionar Novo Parceiro');
        const nameInput = new TextInputBuilder().setCustomId('p_name').setLabel('Nome do Parceiro').setStyle(TextInputStyle.Short).setRequired(true);
        const categoryInput = new TextInputBuilder().setCustomId('p_category').setLabel('Categoria (Ex: Armas, Mecânica)').setStyle(TextInputStyle.Short).setRequired(true);
        const descInput = new TextInputBuilder().setCustomId('p_desc').setLabel('Descrição da Parceria').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const inviteUrl = new TextInputBuilder().setCustomId('p_invite').setLabel('Link de Convite (Opcional)').setStyle(TextInputStyle.Short).setRequired(false);
        const uniformUrl = new TextInputBuilder().setCustomId('p_uniform').setLabel('URL da Imagem do Uniforme (Opcional)').setStyle(TextInputStyle.Short).setRequired(false); // NOVO CAMPO
        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput), 
            new ActionRowBuilder().addComponents(categoryInput),
            new ActionRowBuilder().addComponents(descInput), 
            new ActionRowBuilder().addComponents(inviteUrl),
            new ActionRowBuilder().addComponents(uniformUrl)
        );
        await interaction.showModal(modal);
    }
};