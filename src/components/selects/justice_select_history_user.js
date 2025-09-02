// src/components/selects/justice_select_history_user.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justice_select_history_user',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const targetUserId = interaction.values[0];
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        const punishments = await prisma.punishment.findMany({
            where: { userId: targetUserId, guildId: interaction.guild.id },
            orderBy: { createdAt: 'desc' },
        });

        // CASO 1: FICHA LIMPA
        if (punishments.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#2ecc71') // Verde
                .setAuthor({ name: `DOSSIÊ DISCIPLINAR: ${targetUser.user.tag}`, iconURL: targetUser.displayAvatarURL() })
                .setTitle('STATUS: FICHA LIMPA')
                .setDescription('`[ Nenhuma infração encontrada nos registros. O operativo mantém a conduta exemplar. ]`')
                .setTimestamp()
                .setFooter({ text: 'Sistema de Justiça Visionários' });
            return interaction.editReply({ embeds: [embed] });
        }

        // CASO 2: FICHA COM REGISTROS
        const embed = new EmbedBuilder()
            .setColor('#c0392b') // Vermelho
            .setAuthor({ name: `DOSSIÊ DISCIPLINAR: ${targetUser.user.tag}`, iconURL: targetUser.displayAvatarURL() })
            .setTitle('STATUS: REGISTROS ENCONTRADOS')
            .setDescription(`\`\`\`md\n# ${punishments.length} INFRAÇÕES REGISTRADAS\n\`\`\``)
            .setTimestamp()
            .setFooter({ text: 'Sistema de Justiça Visionários' });

        // Adiciona cada punição como um campo separado, mostrando as 5 mais recentes
        punishments.slice(0, 5).forEach((p, index) => {
            const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][index];
            embed.addFields({
                name: `${emoji} TIPO: ${p.type.toUpperCase()} | DATA: ${p.createdAt.toLocaleDateString('pt-BR')}`,
                value: `> **Motivo:** ${p.reason}\n> **Aplicado por:** <@${p.authorId}>`
            });
        });

        if (punishments.length > 5) {
            embed.addFields({ name: '...', value: `*Exibindo as 5 infrações mais recentes de um total de ${punishments.length}.*` });
        }
            
        await interaction.editReply({ embeds: [embed] });
    }
};