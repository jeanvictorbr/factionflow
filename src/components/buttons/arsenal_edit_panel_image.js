// src/components/buttons/arsenal_edit_panel_image.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'arsenal_edit_panel_image',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const modal = new ModalBuilder().setCustomId('arsenal_modal_panel_image').setTitle('Editar Imagem do Painel de Vendas');
        const urlInput = new TextInputBuilder().setCustomId('image_url').setLabel('URL da Imagem/GIF').setStyle(TextInputStyle.Short).setPlaceholder('https://i.imgur.com/8na0GNy.gif').setValue(config?.salesPanelImageUrl || '').setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(urlInput));
        await interaction.showModal(modal);
    }
};