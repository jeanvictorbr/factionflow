// src/components/buttons/giveaway_set_default_images.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_set_default_images',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const modal = new ModalBuilder().setCustomId('giveaway_set_default_images_modal').setTitle('Definir Imagens Padrão');
        const imageUrlInput = new TextInputBuilder().setCustomId('g_image_url').setLabel('URL da Imagem Principal (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.giveawayDefaultImageUrl || '').setRequired(false);
        const thumbUrlInput = new TextInputBuilder().setCustomId('g_thumb_url').setLabel('URL da Thumbnail (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.giveawayDefaultThumbnailUrl || '').setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(imageUrlInput), new ActionRowBuilder().addComponents(thumbUrlInput));
        await interaction.showModal(modal);
    }
};