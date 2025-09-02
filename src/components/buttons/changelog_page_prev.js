// src/components/buttons/changelog_page_prev.js
const changelogDashboard = require('./changelog_view_main');
module.exports = {
    customId: 'changelog_page_prev',
    async execute(interaction) {
        const page = parseInt(interaction.customId.split('_')[3]);
        if (page > 0) await changelogDashboard.execute(interaction, page - 1);
    }
};