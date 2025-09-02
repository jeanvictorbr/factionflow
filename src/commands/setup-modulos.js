// src/commands/setup-modulos.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prisma = require('../prisma/client');

// Lista dos seus módulos. Você pode adicionar ou remover itens aqui.
const DEFAULT_MODULES = [
    { name: 'Comunicação em Massa', description: 'Módulo para envio de DMs em massa.', emoji: '📣' },
    { name: 'Gerenciamento de Recrutadores', description: 'Sistema de ranking e performance de recrutadores.', emoji: '📈' },
    { name: 'Registro Automatizado', description: 'Sistema de registro customizável e automático.', emoji: '✅' },
    { name: 'Sincronização de Hierarquia', description: 'Mantém os cargos do Discord sincronizados.', emoji: '🔄' },
    { name: 'Módulo Financeiro', description: 'Calculadora, registro de vendas e ranking.', emoji: '💰' },
    { name: 'Sentinela (Relatórios)', description: 'Gera relatórios de performance automáticos.', emoji: '📊' },
    { name: 'Conduta e Punições', description: 'Organiza o histórico de punições.', emoji: '⚖️' },
    { name: 'Padronização de Tags', description: 'Organiza apelidos com tags por cargo.', emoji: '🏷️' },
    { name: 'Depuração de Inativos', description: 'Ferramenta para limpeza de membros inativos.', emoji: '🧹' },
    { name: 'Operações Táticas', description: 'Sistema para agendamento de operações.', emoji: '🎯' },
    { name: 'Gerenciamento de Parcerias', description: 'Painel para visualizar e gerenciar parcerias.', emoji: '🤝' },
    { name: 'Criador de Embeds', description: 'Estúdio para criação de embeds customizadas.', emoji: '🎨' },
    { name: 'Criador de Sorteios', description: 'Crie Sorteios diretamente pelo bot de forma fácil!', emoji: '🔥' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-modulos')
        .setDescription('[DEV] Cria a lista inicial de módulos no banco de dados.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const guildId = interaction.guild.id;

        try {
            // 1. Apaga os módulos antigos para evitar duplicatas
            await prisma.moduleStatus.deleteMany({ where: { guildId: guildId } });

            // 2. Prepara os novos dados
            const modulesToCreate = DEFAULT_MODULES.map(mod => ({
                ...mod,
                guildId: guildId,
                status: 'ONLINE' // Define todos como ONLINE por padrão
            }));

            // 3. Cria todos os novos módulos de uma vez
            await prisma.moduleStatus.createMany({
                data: modulesToCreate,
            });

            await interaction.editReply(`✅ ${DEFAULT_MODULES.length} módulos foram registrados com sucesso no banco de dados!`);

        } catch (error) {
            console.error("Erro ao registrar módulos:", error);
            await interaction.editReply('❌ Ocorreu um erro ao tentar salvar os módulos no banco de dados.');
        }
    },
};