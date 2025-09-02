const partnershipUpdater = require('../../utils/partnershipEmbedUpdater');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'partnerships_select_partner_from_list',
    async execute(interaction) {
        await interaction.deferUpdate();
        const partnerId = interaction.values[0];
        const allPartners = await prisma.partnership.findMany({ where: { guildId: interaction.guild.id }, orderBy: { name: 'asc' } });
        const partnerIndex = allPartners.findIndex(p => p.id === partnerId);
        if (partnerIndex !== -1) {
            await partnershipUpdater.updatePartnershipEmbed(interaction.client, interaction.guild.id, partnerIndex, 'dossier');
        }
    }
};
