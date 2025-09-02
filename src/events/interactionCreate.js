// src/events/interactionCreate.js
const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Seu código de pré-carregamento está ótimo e pode continuar o mesmo.
const componentHandlers = new Map();
const componentDirs = ['buttons', 'modals', 'selects'];
componentDirs.forEach(dir => {
    const handlerPath = path.join(__dirname, '..', 'components', dir);
    if (!fs.existsSync(handlerPath)) return;
    const files = fs.readdirSync(handlerPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
        try {
            const handler = require(path.join(handlerPath, file));
            if (handler.customId) componentHandlers.set(handler.customId, handler);
        } catch (error) {
            console.error(`[FALHA NO CARREGAMENTO] Handler: ${file}`, error);
        }
    }
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (command) await command.execute(interaction, client);
                return;
            }

            let handler = componentHandlers.get(interaction.customId);
            if (!handler) {
                const handlerKey = Array.from(componentHandlers.keys()).find(key => interaction.customId.startsWith(key));
                if (handlerKey) handler = componentHandlers.get(handlerKey);
            }

            if (handler) {
                await handler.execute(interaction, client);
            }

        } catch (error) {
            console.error(`[ERRO CRÍTICO] Falha ao executar a interação ${interaction.customId || interaction.commandName}:`, error);
            
            const friendlyErrorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ Ops! Ocorreu um Erro')
                .setDescription('Encontrei um problema ao tentar processar sua solicitação. A equipe de desenvolvimento já foi notificada.');

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [friendlyErrorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [friendlyErrorEmbed], ephemeral: true });
            }
        }
    },
};