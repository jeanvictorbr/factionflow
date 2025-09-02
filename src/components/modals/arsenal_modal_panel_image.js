// src/components/modals/arsenal_modal_panel_image.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_modal_panel_image',
    async execute(interaction) {
        const imageUrl = interaction.fields.getTextInputValue('image_url');
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { salesPanelImageUrl: imageUrl || null },
            create: { guildId: interaction.guild.id, salesPanelImageUrl: imageUrl || null }
        });
        await interaction.reply({ content: '✅ Imagem do painel de vendas atualizada!', ephemeral: true });
    }
};