// src/components/buttons/partnership_page_prev.js
const { updatePartnershipEmbed } = require('../../utils/partnershipEmbedUpdater');
module.exports = {
    customId: 'partnership_page_prev',
    async execute(interaction) {
        await interaction.deferUpdate();
        const page = parseInt(interaction.customId.split('_')[3]);
        if (page > 0) await updatePartnershipEmbed(interaction.client, interaction.guild.id, page - 1, 'dossier');
    }
};