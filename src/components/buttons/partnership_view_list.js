const partnershipUpdater = require('../../utils/partnershipEmbedUpdater');
module.exports = {
    customId: 'partnership_view_list',
    async execute(interaction) {
        await interaction.deferUpdate();
        const page = parseInt(interaction.customId.split('_')[3]);
        await partnershipUpdater.updatePartnershipEmbed(interaction.client, interaction.guild.id, page, 'list');
    }
};