// src/components/buttons/public_changelog_page_next.js
const { updateChangelogEmbed } = require('../../utils/changelogEmbedUpdater');

module.exports = {
    customId: 'public_changelog_page_next',
    async execute(interaction) {
        await interaction.deferUpdate();
        const page = parseInt(interaction.customId.split('_')[4]);
        await updateChangelogEmbed(interaction.client, interaction.guild.id, page + 1);
    }
};