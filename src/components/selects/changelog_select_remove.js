// src/components/selects/changelog_select_remove.js
const prisma = require('../../prisma/client');
const changelogDashboard = require('../buttons/changelog_view_main');
module.exports = {
    customId: 'changelog_select_remove',
    async execute(interaction) {
        await interaction.deferUpdate();
        const entryId = interaction.values[0];
        await prisma.changelogEntry.delete({ where: { id: entryId } });
        await changelogDashboard.execute(interaction);
    }
};