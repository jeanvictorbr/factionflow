// src/components/buttons/rpainel_view_main.js
const rpainelCommand = require('../../commands/rpainel');

module.exports = {
    customId: 'rpainel_view_main',
    async execute(interaction) {
        await interaction.deferUpdate();
        const panel = await rpainelCommand.buildPanel(interaction);
        await interaction.editReply(panel);
    }
};