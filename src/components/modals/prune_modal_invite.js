// src/components/modals/prune_modal_invite.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'prune_modal_invite',
    async execute(interaction) {
        const link = interaction.fields.getTextInputValue('prune_invite_link');
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { pruneInviteLink: link },
            create: { guildId: interaction.guild.id, pruneInviteLink: link },
        });
        await interaction.reply({ content: `✅ Link de convite para inativos foi atualizado com sucesso!`, ephemeral: true });
    }
};