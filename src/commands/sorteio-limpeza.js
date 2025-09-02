// src/commands/sorteio-limpeza.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prisma = require('../prisma/client');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sorteio-limpeza')
        .setDescription('[DEV] Remove sorteios "órfãos" do banco de dados para corrigir erros.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // 1. Pega os IDs de todos os servidores em que o bot está atualmente.
            const currentGuildIds = interaction.client.guilds.cache.map(g => g.id);

            // 2. Encontra todos os sorteios no banco de dados.
            const allGiveawaysInDb = await prisma.giveaway.findMany();

            // 3. Filtra para encontrar apenas os sorteios "órfãos".
            const orphanGiveaways = allGiveawaysInDb.filter(g => !currentGuildIds.includes(g.guildId));

            if (orphanGiveaways.length === 0) {
                return interaction.editReply({ content: '✅ Nenhuma limpeza necessária. Todos os sorteios no banco de dados pertencem a servidores válidos.' });
            }

            // 4. Apaga os sorteios órfãos.
            const orphanIds = orphanGiveaways.map(g => g.id);
            const deleteResult = await prisma.giveaway.deleteMany({
                where: {
                    id: { in: orphanIds }
                }
            });

            await interaction.editReply({ content: `✅ Limpeza concluída! Foram removidos **${deleteResult.count}** sorteios órfãos que estavam causando erros.` });

        } catch (error) {
            console.error('Falha ao executar a limpeza de sorteios:', error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao tentar executar a limpeza.' });
        }
    },
};