// src/components/selects/partnerships_select_edit.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const { format } = require('date-fns'); // Certifique-se que date-fns está instalado: npm install date-fns

module.exports = {
    customId: 'partnerships_select_edit',
    async execute(interaction) {
        const partnerId = interaction.values[0];
        const partner = await prisma.partnership.findUnique({ where: { id: partnerId } });
        if (!partner) return interaction.update({ content: 'Parceiro não encontrado.', components: [] });

        const modal = new ModalBuilder().setCustomId(`partnerships_modal_submit_${partner.id}`).setTitle(`Editando: ${partner.name}`);
        
        const nameInput = new TextInputBuilder().setCustomId('p_name').setLabel('Nome do Parceiro').setStyle(TextInputStyle.Short).setValue(partner.name);
        const categoryInput = new TextInputBuilder().setCustomId('p_category').setLabel('Categoria').setStyle(TextInputStyle.Short).setValue(partner.category);
        const descInput = new TextInputBuilder().setCustomId('p_desc').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setValue(partner.description);
        const inviteUrl = new TextInputBuilder().setCustomId('p_invite').setLabel('Link de Convite (Opcional)').setStyle(TextInputStyle.Short).setValue(partner.inviteUrl || '').setRequired(false);
        // NOVO CAMPO PARA O UNIFORME
        const uniformUrl = new TextInputBuilder().setCustomId('p_uniform').setLabel('URL da Imagem do Uniforme (Opcional)').setStyle(TextInputStyle.Short).setValue(partner.uniformImageUrl || '').setRequired(false);

        // O campo para a Logo (imagem do carrossel) foi removido da edição
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