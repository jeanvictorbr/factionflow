// src/components/modals/hierarquia_modal_text_config.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'hierarquia_modal_text_config',
    async execute(interaction) {
        const title = interaction.fields.getTextInputValue('h_title');
        const color = interaction.fields.getTextInputValue('h_color');
        const thumbnail = interaction.fields.getTextInputValue('h_thumbnail');

        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: {
                hierarchyEmbedTitle: title,
                hierarchyEmbedColor: color || '#FFFFFF',
                hierarchyEmbedThumbnail: thumbnail || null,
            },
            create: {
                guildId: interaction.guild.id,
                hierarchyEmbedTitle: title,
                hierarchyEmbedColor: color || '#FFFFFF',
                hierarchyEmbedThumbnail: thumbnail || null,
            }
        });

        await interaction.reply({
            content: '✅ Configurações de texto e imagem da hierarquia salvas com sucesso!',
            ephemeral: true,
        });
    }
};