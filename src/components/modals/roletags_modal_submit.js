// src/components/modals/roletags_modal_submit.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'roletags_modal_submit',
    async execute(interaction) {
        const roleId = interaction.customId.split('_')[3];
        const tag = interaction.fields.getTextInputValue('roletag_tag');

        await prisma.roleTag.upsert({
            where: { roleId },
            update: { tag },
            create: { guildId: interaction.guild.id, roleId, tag }
        });
        await interaction.reply({ content: `✅ Tag para o cargo <@&${roleId}> configurada com sucesso! O dashboard será atualizado.`, ephemeral: true });
    }
};