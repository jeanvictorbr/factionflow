// src/components/buttons/arsenal_cancel_delete.js
const { ButtonInteraction } = require('discord.js');
module.exports = {
    customId: 'arsenal_cancel_delete',
    async execute(interaction) {
        await interaction.update({ content: 'Operação de remoção cancelada.', components: [] });
    }
};