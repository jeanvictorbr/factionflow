// src/components/buttons/prune_config_invite.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'prune_config_invite',
    async execute(interaction) {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const modal = new ModalBuilder().setCustomId('prune_modal_invite').setTitle('Editar Link de Convite');
        const linkInput = new TextInputBuilder()
            .setCustomId('prune_invite_link')
            .setLabel('URL do Convite Permanente')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://discord.gg/seuconvite')
            .setValue(config?.pruneInviteLink || 'https://discord.gg/VK5JP7HUMt')
            .setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(linkInput));
        await interaction.showModal(modal);
    }
};