// src/components/modals/registro_modal_embed_config.js
const { ModalSubmitInteraction } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const HEADER_IMAGE_URL = 'https://i.imgur.com/5zM1pLe.gif';

module.exports = {
    customId: 'registro_modal_embed_config',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // 1. Extrai os dados dos campos do modal
            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_description');
            const image = interaction.fields.getTextInputValue('embed_image');

            // 2. Salva os dados no banco de dados
            await prisma.guildConfig.upsert({
                where: { guildId: interaction.guild.id },
                update: {
                    registroEmbedTitle: title,
                    registroEmbedDesc: description,
                    registroEmbedImage: image || null,
                    // Linha removida: registroEmbedThumb: embedThumbnail || null,
                },
                create: {
                    guildId: interaction.guild.id,
                    registroEmbedTitle: title,
                    registroEmbedDesc: description,
                    registroEmbedImage: image || null,
                    // Linha removida: registroEmbedThumb: embedThumbnail || null,
                },
            });

            // 3. Envia um feedback de sucesso para o administrador
            await interaction.editReply({
                content: '✅ As configurações da embed de registro foram salvas com sucesso!'
            });

        } catch (error) {
            console.error("Erro ao salvar config da embed:", error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao salvar as configurações no banco de dados. Por favor, tente novamente.'
            });
        }
    }
};