// src/components/selects/roletags_select_role.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'roletags_select_role',
    async execute(interaction) {
        const roleId = interaction.values[0];
        const role = await interaction.guild.roles.fetch(roleId);
        const existingTag = await prisma.roleTag.findUnique({ where: { roleId } });
        
        const modal = new ModalBuilder()
            .setCustomId(`roletags_modal_submit_${roleId}`)
            .setTitle(`Configurando Tag: ${role.name}`);

        const tagInput = new TextInputBuilder()
            .setCustomId('roletag_tag')
            .setLabel('TAG (Ex: [D] ou [Visionários])')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(existingTag?.tag || ''); // Preenche com a tag atual, se existir

        // ===================================================================
        // CORREÇÃO APLICADA AQUI
        // O campo de "Prioridade" foi completamente removido.
        // ===================================================================
        
        modal.addComponents(new ActionRowBuilder().addComponents(tagInput));

        await interaction.showModal(modal);
    }
};