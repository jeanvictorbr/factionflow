// src/components/modals/partnerships_modal_submit.js
const prisma = require('../../prisma/client');
const { updatePartnershipEmbed } = require('../../utils/partnershipEmbedUpdater');

module.exports = {
    customId: 'partnerships_modal_submit',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const partnerId = interaction.customId.split('_')[3];
        
        const name = interaction.fields.getTextInputValue('p_name');
        const category = interaction.fields.getTextInputValue('p_category');
        const description = interaction.fields.getTextInputValue('p_desc');
        const inviteUrl = interaction.fields.getTextInputValue('p_invite');
        const uniformImageUrl = interaction.fields.getTextInputValue('p_uniform');

        try {
            if (partnerId) { // MODO DE EDIÇÃO
                await prisma.partnership.update({ 
                    where: { id: partnerId }, 
                    // Atualiza apenas os campos relevantes para a edição
                    data: { name, category, description, inviteUrl, uniformImageUrl } 
                });
                await interaction.editReply(`✅ Parceiro **${name}** atualizado com sucesso!`);
            } else { // MODO DE CRIAÇÃO
                const imageUrl = interaction.fields.getTextInputValue('p_image'); // p_image só existe na criação
                await prisma.partnership.create({ 
                    data: { guildId: interaction.guild.id, name, category, description, imageUrl, inviteUrl, uniformImageUrl } 
                });
                await interaction.editReply(`✅ Parceiro **${name}** adicionado à categoria **${category}**!`);
            }
            // Atualiza o painel público em ambos os casos
            await updatePartnershipEmbed(interaction.client, interaction.guild.id);
        } catch (error) {
             if (error.code === 'P2002') return interaction.editReply(`⚠️ Um parceiro com o nome **${name}** já existe.`);
             console.error(error);
             await interaction.editReply('❌ Ocorreu um erro ao salvar os dados.');
        }
    }
};