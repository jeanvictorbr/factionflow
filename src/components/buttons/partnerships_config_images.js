// src/components/buttons/partnerships_config_images.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'partnerships_config_images',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const modal = new ModalBuilder().setCustomId('partnerships_modal_images').setTitle('Configurar Imagens de Parceria');
        const thumbInput = new TextInputBuilder().setCustomId('p_thumb').setLabel('URL da Thumbnail Padrão (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.partnershipDefaultThumbnailUrl || '').setRequired(false);
        const imageInput = new TextInputBuilder().setCustomId('p_image').setLabel('URL da Imagem Principal Padrão (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.partnershipDefaultImageUrl || '').setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(thumbInput), new ActionRowBuilder().addComponents(imageInput));
        await interaction.showModal(modal);
    }
};