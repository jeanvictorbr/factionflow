// src/components/selects/partnerships_select_remove.js
const prisma = require('../../prisma/client');
const { updatePartnershipEmbed } = require('../../utils/partnershipEmbedUpdater');

module.exports = {
    customId: 'partnerships_select_remove',
    async execute(interaction) {
        const partnerIdToRemove = interaction.values[0];

        try {
            const partner = await prisma.partnership.delete({
                where: { id: partnerIdToRemove }
            });

            // Atualiza o painel público para remover o parceiro da vitrine
            await updatePartnershipEmbed(interaction.client, interaction.guild.id);

            await interaction.update({ content: `✅ A parceria com **${partner.name}** foi removida com sucesso!`, components: [] });
        } catch (error) {
            console.error("Erro ao remover parceiro:", error);
            await interaction.update({ content: `❌ Ocorreu um erro ao remover este parceiro. Ele pode já ter sido removido.`, components: [] });
        }
    }
};