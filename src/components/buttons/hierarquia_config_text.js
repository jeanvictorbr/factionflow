// src/components/buttons/hierarquia_config_text.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'hierarquia_config_text',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({
            where: { guildId: interaction.guild.id },
        });

        const modal = new ModalBuilder()
            .setCustomId('hierarquia_modal_text_config')
            .setTitle('Configurar Textos da Hierarquia');

        const titleInput = new TextInputBuilder()
            .setCustomId('h_title')
            .setLabel('Título da Embed')
            .setStyle(TextInputStyle.Short)
            .setValue(config?.hierarchyEmbedTitle || '👑 Hierarquia de Cargos 👑')
            .setRequired(true);

        const colorInput = new TextInputBuilder()
            .setCustomId('h_color')
            .setLabel('Cor da Embed (Hex ou Nome em Inglês)')
            .setStyle(TextInputStyle.Short)
            .setValue(config?.hierarchyEmbedColor || '#FFFFFF')
            .setPlaceholder('Ex: #FF5733, BLUE, #FFF')
            .setRequired(false);

        const thumbInput = new TextInputBuilder()
            .setCustomId('h_thumbnail')
            .setLabel('URL da Thumbnail (Opcional)')
            .setStyle(TextInputStyle.Short)
            .setValue(config?.hierarchyEmbedThumbnail || '')
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(thumbInput)
        );

        await interaction.showModal(modal);
    }
};