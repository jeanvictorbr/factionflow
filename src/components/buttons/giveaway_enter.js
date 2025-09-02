// src/components/buttons/giveaway_enter.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'giveaway_enter',
    async execute(interaction) {
        // Resposta imediata para o Discord, mas invisível ao usuário
        await interaction.deferUpdate();

        const giveaway = await prisma.giveaway.findUnique({ where: { messageId: interaction.message.id } });
        if (!giveaway || giveaway.status !== 'RUNNING') return;

        let entrants = giveaway.entrants || [];
        const userInGiveaway = entrants.includes(interaction.user.id);
        let replyMessage = '';

        if (userInGiveaway) {
            entrants = entrants.filter(id => id !== interaction.user.id);
            replyMessage = 'Você saiu do sorteio.';
        } else {
            entrants.push(interaction.user.id);
            replyMessage = '✅ Você entrou no sorteio! Boa sorte.';
        }

        // Atualiza o banco de dados
        await prisma.giveaway.update({
            where: { messageId: interaction.message.id },
            data: { entrants: { set: entrants } }
        });

        // ATUALIZAÇÃO EM TEMPO REAL DA EMBED
        const updatedEmbed = new EmbedBuilder(interaction.message.embeds[0]);
        const lastTenEntrants = entrants.slice(-10).map(id => `<@${id}>`).join('\n');

        updatedEmbed.setFields(
            { name: 'Vencedores', value: String(giveaway.winnerCount), inline: true },
            { name: 'Participantes', value: `**${entrants.length}**`, inline: true },
            { name: 'Últimos a entrar', value: lastTenEntrants || '`Nenhum participante ainda.`', inline: false }
        );

        if (giveaway.requiredRoleId) {
             updatedEmbed.addFields({ name: 'Requisito', value: `Apenas membros com o cargo <@&${giveaway.requiredRoleId}> podem ganhar.` });
        }

        await interaction.message.edit({ embeds: [updatedEmbed] });
        await interaction.followUp({ content: replyMessage, ephemeral: true });
    }
};