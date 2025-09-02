// src/components/modals/blacklist_modal_add.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'blacklist_modal_add',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.fields.getTextInputValue('bl_userid');
        const reason = interaction.fields.getTextInputValue('bl_reason');
        if (!/^\d{17,19}$/.test(userId)) return interaction.editReply({ content: '❌ ID de usuário inválido.' });

        try {
            await prisma.blacklist.create({ /* ... dados ... */ });
            
            // LÓGICA DE EXPULSÃO IMEDIATA
            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (member) {
                await member.kick(`Adicionado à blacklist por ${interaction.user.tag}. Motivo: ${reason}`);
                await interaction.editReply({ content: `✅ Usuário \`${userId}\` adicionado à blacklist e **expulso do servidor**!` });
            } else {
                await interaction.editReply({ content: `✅ Usuário \`${userId}\` adicionado à blacklist! (Ele não estava no servidor).` });
            }
        } catch (error) { /* ... tratamento de erro ... */ }
    }
};