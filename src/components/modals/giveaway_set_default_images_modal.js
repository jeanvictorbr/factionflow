// src/components/modals/giveaway_set_default_images_modal.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'giveaway_set_default_images_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const imageUrl = interaction.fields.getTextInputValue('g_image_url');
        const thumbUrl = interaction.fields.getTextInputValue('g_thumb_url');
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { giveawayDefaultImageUrl: imageUrl || null, giveawayDefaultThumbnailUrl: thumbUrl || null },
            create: { guildId: interaction.guild.id, giveawayDefaultImageUrl: imageUrl || null, giveawayDefaultThumbnailUrl: thumbUrl || null },
        });
        await interaction.editReply(`✅ Imagens padrão para sorteios foram atualizadas!`);
    }
};