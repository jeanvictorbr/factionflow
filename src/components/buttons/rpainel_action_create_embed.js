// src/components/buttons/rpainel_action_create_embed.js
const embedCommandHandler = require('../../commands/embed');
module.exports = {
    customId: 'rpainel_action_create_embed',
    async execute(interaction) {
        // Reutiliza a lógica do comando /embed para abrir o seletor de canal
        await embedCommandHandler.execute(interaction);
    }
};