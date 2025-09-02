// src/components/buttons/embed_confirm_finalize.js
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'embed_confirm_finalize',
    async execute(interaction) {
        await interaction.deferUpdate();
        const messageId = interaction.customId.split('_')[3];

        // Encontra a mensagem original e remove os botões
        await interaction.channel.messages.edit(messageId, { components: [] });

        // Apaga o registro do banco de dados, pois não é mais necessário gerenciar esta embed
        await prisma.customEmbed.delete({ where: { messageId } }).catch(err => {
            console.warn(`[AVISO] Não foi possível apagar o registro da embed ${messageId} do banco. Ele pode já ter sido removido.`);
        });

        await interaction.editReply({ content: '✅ Embed finalizada com sucesso!', embeds: [], components: [] });
    }
};