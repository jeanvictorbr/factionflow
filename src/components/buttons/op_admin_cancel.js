// src/components/buttons/op_admin_cancel.js
const { PermissionFlagsBits } = require('discord.js');
const prisma = require('../../prisma/client');
const { updateOperationEmbed } = require('../../utils/operationEmbedUpdater');
module.exports = {
    customId: 'op_admin_cancel',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'Apenas a liderança pode cancelar uma operação.', ephemeral: true });
        await interaction.deferUpdate();
        const operationId = interaction.customId.split('_')[3];
        await prisma.operation.update({ where: { id: operationId }, data: { status: 'CANCELADA' } });
        await updateOperationEmbed(interaction.client, operationId);
    }
};