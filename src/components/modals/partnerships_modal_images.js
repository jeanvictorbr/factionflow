// src/components/modals/partnerships_modal_images.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'partnerships_modal_images',
    async execute(interaction) {
        const thumbUrl = interaction.fields.getTextInputValue('p_thumb');
        const imageUrl = interaction.fields.getTextInputValue('p_image');
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { partnershipDefaultThumbnailUrl: thumbUrl, partnershipDefaultImageUrl: imageUrl },
            create: { guildId: interaction.guild.id, partnershipDefaultThumbnailUrl: thumbUrl, partnershipDefaultImageUrl: imageUrl }
        });
        await interaction.reply({ content: '✅ Imagens padrão do painel de parcerias foram atualizadas!', ephemeral: true });
    }
};