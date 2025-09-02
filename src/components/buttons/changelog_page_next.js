// src/components/buttons/changelog_page_next.js
const changelogDashboard = require('./changelog_view_main');
module.exports = {
    customId: 'changelog_page_next',
    async execute(interaction) {
        const page = parseInt(interaction.customId.split('_')[3]);
        await changelogDashboard.execute(interaction, page + 1);
    }
};