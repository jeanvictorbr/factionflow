// src/components/buttons/changelog_action_add.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'changelog_action_add',
    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
                .setCustomId('changelog_modal_add')
                .setTitle('Nova Entrada no Changelog');
            
            const versionInput = new TextInputBuilder()
                .setCustomId('cl_version')
                .setLabel('Versão (ex: v3.1)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const titleInput = new TextInputBuilder()
                .setCustomId('cl_title')
                .setLabel('Título da Atualização') // Você pode incluir o emoji aqui se quiser
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const descInput = new TextInputBuilder()
                .setCustomId('cl_desc')
                .setLabel('Descrição Detalhada')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const notifyInput = new TextInputBuilder()
                .setCustomId('cl_notify')
                .setLabel('Notificar @everyone? (Sim/Nao)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            // A variável 'typeInput' e sua ActionRow foram completamente removidas.
            
            modal.addComponents(
                new ActionRowBuilder().addComponents(versionInput),
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descInput),
                new ActionRowBuilder().addComponents(notifyInput)
            );
            
            await interaction.showModal(modal);

        } catch (error) {
            console.error(`Erro no botão ${module.exports.customId}:`, error);
        }
    }
};